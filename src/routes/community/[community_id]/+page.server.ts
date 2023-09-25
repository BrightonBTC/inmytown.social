import { type CommunityMeta, Community } from "$lib/community/community";
import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import ndkStore from "$lib/ndk";
import { get } from "svelte/store";
const ndk = get(ndkStore);

export const load: PageServerLoad = async ({ params }): Promise<CommunityMeta | null> => {
    try {
        let community:Community = new Community(ndk)
        let result = community.fetchMeta(params.community_id)
        return result;
    } 
    catch (e) {
        throw error(500, 'An error occurred processing this request: '+e);
    }
}
