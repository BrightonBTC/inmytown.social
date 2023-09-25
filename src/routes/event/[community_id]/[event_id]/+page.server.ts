import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import ndkStore from "$lib/ndk";
import { get } from "svelte/store";
import { MeetupEvent, type EventMeta } from "$lib/event/event";
import { Community } from "$lib/community/community";
const ndk = get(ndkStore);

type resultObj = {
    event: EventMeta | null
}

export const load: PageServerLoad = async ({ params }): Promise<resultObj> => {
    let response:resultObj = {event:null}
    try {
        let community = new Community(ndk)
        let success = await community.fetchMeta(params.community_id)
        if(success){
            let event = new MeetupEvent(ndk)
            let success = await event.fetch(params.event_id, community.meta.eid, community.meta.authorhex)
            if(success) response.event = event.meta
        } 
        return response
    } 
    catch (e) {
        throw error(500, 'An error occurred processing this request: '+e);
    }
}
