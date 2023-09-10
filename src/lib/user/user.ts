import { profile, uHex, uNpub, userHasSigner, userHex, userNpub, userProfile } from "$lib/stores"
import NDK, { NDKEvent, NDKUser } from "@nostr-dev-kit/ndk"

export interface UserStatus{
    communities: string[]
    interests: string[]
    status?: string
    locationStatus?: LocationStatus
    country?: string
    city?: string
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
                let u = await ndk.getUser({npub: user?.npub})
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

export async function subUserStatus(ndk: NDK, npub: string, cb: (data: UserStatus) => void) {
    let lastUpd = 0;
    try {
        const communitySub = ndk.subscribe(
            { kinds: [10037], "authors": [npub] }
        );
        communitySub.on("event", (event: NDKEvent) =>  {
            if (event.created_at && event.created_at > lastUpd) {
                lastUpd = event.created_at;
                cb(parseUserStatusData(event));
            }
        });
    } catch (err) {
        console.log("An ERROR occured when subscribing to user status", err);
    } 
}

export async function fetchFollows(ndk: NDK, npub: string){
    let out: NDKUser[] = [];
    if(ndk && npub){
        let user = await fetchUser(ndk, npub);
        let f = await user?.follows()
        if(f) out = [...f]
    } 
    return out;
}

export function parseUserStatusData(result:NDKEvent){
    let data: UserStatus = {
        communities: [],
        interests: []
    };
    data.communities = result?.tags.filter((t) => t[0] === 'e').map(a => a[1]) || [];
    if(result && result?.content.trim().length > 0){
        data.status = result?.content;
    }
    let tags = result?.tags.filter((t) => t[0] !== 'e')
    tags?.forEach(function(t){
        switch(t[0]){
            case 'c':
                let c = t[1].trim().split(' ');
                data.city = c[0];
                if(c.length > 1) data.country = c[1];
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

export async function publishUserStatus(ndk:NDK, data: UserStatus) {
    let response: NDKEvent | string | null = null;
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
            ndkEvent.tags.push(["c", data.city + ' ' + data.country]);
            //ndkEvent.tags.push(["n", data.country]);
            ndkEvent.tags.push(["locationStatus", data.locationStatus]);
        }
        await ndkEvent.publish();
        return ndkEvent
    }catch (err) {
        return "An ERROR occured publishing the community metadata:"+ err;
    } 
}
