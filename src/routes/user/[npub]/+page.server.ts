import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import ndkStore from "$lib/ndk";
import { get } from "svelte/store";
import { MeetupUser } from "$lib/user/user";
import type { NDKUserProfile } from "@nostr-dev-kit/ndk";
const ndk = get(ndkStore);

type userObj = {
    npub: string,
    profile: NDKUserProfile
}

export const load: PageServerLoad = async ({ params }): Promise<userObj> => {
    let meetupUser:MeetupUser = new MeetupUser({npub:params.npub})
    try {
        meetupUser.ndk = ndk
        await meetupUser.fetchProfile()
        if(meetupUser.profile){
            return Promise.resolve({
                npub: params.npub,
                profile: meetupUser.profile
            } as userObj)
        } 
        else{
            throw error(404, 'Profile not found');
        }
    } 
    catch (e) {
        throw error(500, 'An error occurred processing this request: '+e);
    }
}
