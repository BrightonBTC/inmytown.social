
import type { Community } from '$lib/community/community';
import type { EventMeta, MeetupEvent } from '$lib/event/event';
import { writable } from 'svelte/store';

export const community = writable<Community>();

export const eventList = writable<EventMeta[]>([]);
export function addEvent(e: EventMeta){
    eventList.update(items => {
        items.push(e)
        return [...new Map(items.map(v => [v.uid, v])).values()]
    })
}

export const signalUpdMap = writable({});
//export const eventMetaStore = writable<EventMeta>({...EventMetaDefaults});

export const meetupStore = writable<MeetupEvent>();

