import { type CommunityMeta, Community } from "$lib/community/community";
import type { NDKEvent } from "@nostr-dev-kit/ndk";
import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import ndkStore from "$lib/ndk";
import { get } from "svelte/store";
const ndk = get(ndkStore);

export const load: PageServerLoad = async ({ params }) => {
    let communityMeta:CommunityMeta;
    let evt: Set<NDKEvent> = new Set();
    try {
        evt = await ndk.fetchEvents({'#e':[params.community_id], kinds:[30037]}, {closeOnEose:true});
    } catch (e) {
        throw error(500, 'An error occurred processing this request: '+e);
    }
    if(evt.size > 0) communityMeta = Community.parseNostrEvent([...evt][0])
    else {
        throw error(404, 'Community not found');
    }
    return communityMeta;
}
