import type { EventMeta } from '$lib/event/event';
import { writable } from 'svelte/store';

export const myEvents = writable<Array<EventMeta>>([]);

export function addEvent(item: EventMeta){
    myEvents.update(items => {
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
}