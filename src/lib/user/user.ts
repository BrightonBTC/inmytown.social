import { browser } from "$app/environment"
import { npub } from "$lib/stores/persistent"
import { loggedInUser } from "$lib/stores/user"
import NDK, { NDKEvent, NDKSubscription, NDKUser, type NDKFilter, type NDKSubscriptionOptions, type NostrEvent, NDKKind } from "@nostr-dev-kit/ndk"
import { get } from "svelte/store"

export interface UserStatus{
    communities: string[]
    interests: string[]
    status?: string
    locationStatus?: LocationStatus
    country?: string
    city?: string
}

export class MeetupUser extends NDKUser {

    public status?: UserStatus= {
        communities: [],
        interests: []
    }

    public constructor(opts: {}){
        super(opts)
    }

    public async fetchStatus(): Promise<void>{
        try{
            let events = await this.ndk?.fetchEvents({
                authors: [this.hexpubkey()],
                kinds: [10037]
            }, {closeOnEose:true})
            if(events && events.size > 0){
                this.status = MeetupUser.parseStatus([...events][0])
            }
        }
        catch(error){
            console.log('An error occurred fetching status: '+error)
        }
    }

    public async unfollow(
        userToUnfollow: NDKUser,
        currentFollowList?: Set<NDKUser>): Promise<boolean>{
            if (!this.ndk) throw new Error("No NDK instance found");

            this.ndk.assertSigner();
            
            try{
                if (!currentFollowList) {
                    currentFollowList = await this.follows();
                }
    
                let reducedList = [...currentFollowList].filter((v) => v.npub !== userToUnfollow.npub)
    
                const event = new NDKEvent(this.ndk, {
                    kind: NDKKind.Contacts,
                } as NostrEvent);
    
                for (const follow of reducedList) {
                    event.tag(follow);
                }
        
                await event.publish();
        
                return Promise.resolve(true);
            }
            catch(error){
                console.log('An error occurred trying to unfollow: '+error)
            }
            return Promise.resolve(false);
    }

    public static parseStatus(event: NDKEvent){
        let data: UserStatus = {
            communities: [],
            interests: []
        };
        data.communities = event.tags.filter((t) => t[0] === 'e').map(a => a[1]) || [];
        if(event && event.content.trim().length > 0){
            data.status = event.content;
        }
        let tags = event.tags.filter((t) => t[0] !== 'e')
        tags?.forEach(function(t){
            switch(t[0]){
                case 'g':
                    const locationParts = t[1].split(':')
                    data.country = locationParts[0]
                    data.city = locationParts[1]
                break;
                case 't':
                    data.interests.push(t[1]);
                break;
                case 'status':
                    data.status = t[1];
                break;
                case 'locationStatus':
                    data.locationStatus = t[1] as LocationStatus;
                break;
            }
        })
        return data;
    }
}

export class UserSubscriptions {
    public ndk: NDK;
    private subscriptions: NDKSubscription[] = [];

    public constructor(ndk: NDK){
        this.ndk = ndk
    }

    public async subscribeStatuses(filter: NDKFilter, cb: (data: NDKEvent) => void, opts?: NDKSubscriptionOptions): Promise<void>{
        filter.kinds = [10037]
        try {
            const sub = this.ndk.subscribe(
                filter,
                opts
            );
            if(opts && opts.closeOnEose === false){
                this.subscriptions.push(sub)
            }
            sub.on("event", (event: NDKEvent) =>  {
                cb(event)
            });
        } catch (err) {
            console.log("An ERROR occured when subscribing to events", err);
        } 
    }

    public closeSubscriptions(){
        this.subscriptions.forEach(function(sub){
            sub.stop()
        })
    }
}

export async function login(ndk: NDK): Promise<boolean> {
    let res:boolean = false
    let _loggedInUser = get(loggedInUser)
    let _npub:string = get(npub)

    if(browser && !window.nostr) res = false
    else if(_loggedInUser) res = true
    else if (_npub.length > 0){
        setLoggedInUserByNpub(ndk, _npub)
        res = true
    }
    else{
        try{
            await ndk.signer?.user().then(async (user) => {
                if (user.npub) {
                    console.log(
                        "Permission granted to read public key:",
                        user.npub
                    );
                    npub.set(user.npub)
                    setLoggedInUserByNpub(ndk, user.npub)
                    res = true
                }
                else{
                    res = false
                }
            })
        }
        catch(error){
            console.log("An ERROR occured when subscribing to events", error);
            res = false
        }
    }
    return Promise.resolve(res)
}
function setLoggedInUserByNpub(ndk:NDK, npub: string){
    let meetupUser = new MeetupUser({npub:npub})
    meetupUser.ndk = ndk
    loggedInUser.set(meetupUser)
}


export let fetchUser = async function (ndk: NDK, npub: string): Promise<NDKUser | undefined> {
    let user: NDKUser | undefined;
    try {
        user = ndk?.getUser({
            npub: npub,
        });
        await user?.fetchProfile();
    } catch (error) {
        console.log("An ERROR occured when fetching user", error);
    } finally{
        return Promise.resolve(user);
    }
};

export async function publishUserStatus(ndk:NDK, data: UserStatus): Promise<void> {
    try{
        const ndkEvent = new NDKEvent(ndk);
        ndkEvent.kind = 10037;
        if (data.communities && data.communities.length > 0) {
            data.communities.forEach(function (t) {
                ndkEvent.tags.push(["e", t]);
            });
        }
        if (data.interests && data.interests.length > 0) {
            data.interests.forEach(function (t) {
                ndkEvent.tags.push(["t", t]);
            });
        }
        if(data.status) ndkEvent.content = data.status
        if(data.locationStatus && data.city && data.country){
            ndkEvent.tags.push(["g", data.country + ':' + data.city, 'city']);
            ndkEvent.tags.push(["locationStatus", data.locationStatus]);
        }
        await ndkEvent.publish();
    } catch (err) {
        console.log("An ERROR occured publishing the community metadata:"+ err);
    } 
}
