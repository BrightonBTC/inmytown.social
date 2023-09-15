import ndk from "$lib/ndk"
import { profile, uHex, uNpub, userHasSigner, userHex, userNpub, userProfile } from "$lib/stores"
import NDK, { NDKEvent, NDKSubscription, NDKUser, type NDKFilter, type NDKSubscriptionOptions } from "@nostr-dev-kit/ndk"

export interface UserStatus{
    communities: string[]
    interests: string[]
    status?: string
    locationStatus?: LocationStatus
    country?: string
    city?: string
}

export class MeetupUser extends NDKUser {

    public status?: UserStatus;

    public constructor(opts: {}){
        super(opts)
        this.ndk = ndk
    }

    public async fetchStatus(){
        let events = await this.ndk?.fetchEvents({
            authors: [this.hexpubkey()],
            kinds: [10037]
        }, {})
        if(events && events.size > 0){
            this.status = MeetupUser.parseStatus([...events][0])
        }
    }

    public async publishStatus(){

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

    public async subscribeStatuses(filter: NDKFilter, cb: (data: NDKEvent) => void, opts?: NDKSubscriptionOptions){
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


export async function login(ndk: NDK) {
    if(!userHasSigner) return false;
    let loggedin = false
    if(!uNpub || !uHex || !profile){
        await ndk.signer?.user().then(async (user) => {
            if (!!user.npub) {
                console.log(
                    "Permission granted to read their public key:",
                    user.npub
                );
                userNpub.set(user.npub)
                userHex.set(user.hexpubkey())
                let u = ndk.getUser({npub: user?.npub})
                await u.fetchProfile();
                userProfile.set(JSON.stringify(u.profile));
                loggedin = true
            }
        });
    }
    else{
        loggedin = true
    }
    return loggedin;
}


export let fetchUser = async function (ndk: NDK, npub: string) {
    let user: NDKUser | undefined;
    try {
        user = ndk?.getUser({
            npub: npub,
        });
        await user?.fetchProfile();
    } catch (error) {
        console.log("An ERROR occured when fetching user", error);
    } finally{
        return user;
    }
};

export async function publishUserStatus(ndk:NDK, data: UserStatus) {
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
        return ndkEvent
    } catch (err) {
        return "An ERROR occured publishing the community metadata:"+ err;
    } 
}
