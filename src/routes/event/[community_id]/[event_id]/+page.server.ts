import type { NDKEvent } from "@nostr-dev-kit/ndk";
import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import ndkStore from "$lib/ndk";
import { get } from "svelte/store";
import { MeetupEvent, type EventMeta, EventMetaDefaults } from "$lib/event/event";
import { Community, CommunityMetaDefaults } from "$lib/community/community";
const ndk = get(ndkStore);

export const load: PageServerLoad = async ({ params }): Promise<EventMeta> => {
    let eventMeta:EventMeta;
    let evts: Set<NDKEvent> = new Set();
    try {
        evts = await ndk.fetchEvents({'#e':[params.community_id], kinds:[30037]}, {closeOnEose:true});
        if(evts.size > 0){
            let community = [...evts][0]
            let events: Set<NDKEvent>;
            events = await ndk.fetchEvents({ 
                kinds: [31923], 
                "#d": [params.event_id],
                "#e": [params.community_id],
                "authors": [community.author.hexpubkey()]
            })
            
            if(events.size > 0){
                let meta = {
                    ...EventMetaDefaults,
                    community: {
                        ...CommunityMetaDefaults,
                        ...Community.parseNostrEvent(community)
                    }
                };
                eventMeta = MeetupEvent.parseNostrEvent([...events][0], meta)
            }
            else {
                throw error(404, 'Event not found');
            }
        }
        else {
            throw error(404, 'Community not found');
        }
        return Promise.resolve(eventMeta);
    } 
    catch (e) {
        throw error(500, 'An error occurred processing this request: '+e);
    }
}
