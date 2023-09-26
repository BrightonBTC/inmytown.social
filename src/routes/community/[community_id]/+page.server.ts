import { type CommunityMeta, Community } from "$lib/community/community";
import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import ndkStore from "$lib/stores/ndk";
import { get } from "svelte/store";
const ndk = get(ndkStore);

type resultObj = {
    community: CommunityMeta | null
}

export const load: PageServerLoad = async ({ params }): Promise<resultObj> => {
    try {
        let community:Community = new Community(ndk)
        let result = await community.fetchMeta(params.community_id)
        return {community: result} as resultObj
    } 
    catch (e) {
        throw error(500, 'An error occurred processing this request: '+e);
    }
}
