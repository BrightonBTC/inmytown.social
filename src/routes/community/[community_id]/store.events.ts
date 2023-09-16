import type { EventMeta } from "$lib/event/event";
import { derived, writable } from "svelte/store";

export const communityEvents = writable<EventMeta[]>([]);

export function addEventMeta(item: EventMeta){

    communityEvents.update(items => {
        let matches = items.filter(v => v.eid === item.eid)
        if(matches.length > 0){
            if(matches[0].updated < item.updated){
                items = items.filter(v => v.eid !== item.eid)
                items.push(item)
            }
        }
        else{
            items.push(item)
        }
        return items
    })
    
};

export const sortedUpcoming = derived(communityEvents, (v) => {
    let filtered = v.filter((item) => item.status !=='draft' && item.starts >= (Date.now() / 1000))
    return filtered.sort((a, b) => a.starts - b.starts)
})

export const sortedPast = derived(communityEvents, (v) => {
    let filtered = v.filter((item) => item.status !=='draft' && item.starts < (Date.now() / 1000))
    return filtered.sort((a, b) => a.starts - b.starts)
})