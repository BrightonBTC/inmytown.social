import type { CommunityMeta } from "$lib/community/community";
import type { EventMeta } from "$lib/event/event";
import { derived, writable } from "svelte/store";

export const communities = writable<Array<CommunityMeta>>([]);
export const events = writable<Array<EventMeta>>([]);

export function addCommunity(e: CommunityMeta){
    communities.update(items => {
        items.push(e)
        return [...new Map(items.map(v => [v.eid, v])).values()]
    })
}
export const sortedCommunities = derived(communities, (v) => v.sort((a, b) => b.created && a.created ? b.created - a.created: 0))

export function addEvent(e: EventMeta){
    let now = new Date()
    if(e.ends < now.getTime() / 1000) return;
    events.update(items => {
        let inList = items.filter(v => v.eid === e.eid)
        // check if we have an earlier version of the event and replace it
        if(inList.length > 0 && e.updated && e.updated > inList[0].updated){
            items = items.filter(v => v.eid !== inList[0].eid)
            items.push(e)
        }
        else items.push(e)
        return [...new Map(items.map(v => [v.eid, v])).values()]
    })
}
export const sortedEvents = derived(events, (v) => v.sort((a, b) => a.starts && b.starts ? a.starts - b.starts: 0))