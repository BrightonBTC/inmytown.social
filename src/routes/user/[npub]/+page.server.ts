import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import ndkStore from "$lib/stores/ndk";
import { get } from "svelte/store";
import { MeetupUser } from "$lib/user/user";
import type { NDKUserProfile } from "@nostr-dev-kit/ndk";
const ndk = get(ndkStore);

type userObj = {
    npub: string,
    profile: NDKUserProfile | undefined
}

export const load: PageServerLoad = async ({ params }): Promise<userObj> => {
    let meetupUser:MeetupUser = new MeetupUser({npub:params.npub})
    let userObj:userObj = {npub:params.npub, profile:undefined}
    try {
        meetupUser.ndk = ndk
        let profile = await meetupUser.fetchProfile()
        if(profile && profile?.size > 0){
            userObj.profile = meetupUser.profile
        } 
        return Promise.resolve(userObj)
    } 
    catch (e) {
        throw error(500, 'An error occurred processing this request: '+e);
    }
}
