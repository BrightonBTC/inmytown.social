
import { Community } from '$lib/community/community';
import type { EventMeta } from '$lib/event/event';
import ndk from '$lib/ndk';
import type { NDKEvent } from '@nostr-dev-kit/ndk';
import { derived, writable } from 'svelte/store';

export const community = writable<Community>(new Community(ndk));

export const communityMembers = writable<string[]>([]);

export function addMember(s: string){
    communityMembers.update(items => {
        items.push(s)
        return [...new Map(items.map(v => [v, v])).values()]
    })
};

export function removeMember(s: string){
    communityMembers.update(items => items.filter((itm) => itm !== s))
};

export const communityEvents = writable<string[]>([]);

export const communityEventsDraft = writable<[number, string, EventMeta][]>([]);
export const communityEventsUpcoming = writable<[number, string, EventMeta][]>([]);
export const communityEventsPast = writable<[number, string, EventMeta][]>([]);

export function addEvent(s: string){
    communityEvents.update(items => [...items, s])
};

export function addEventMeta(o: EventMeta){
    if(o.status === 'draft'){
        communityEventsDraft.update(items => [...items, [o.starts, o.eid, o]])
    }
    else if(o.starts > (Date.now() / 1000)){
        communityEventsUpcoming.update(items => [...items, [o.starts, o.eid, o]])
    }
    else{
        communityEventsPast.update(items => [...items, [o.starts, o.eid, o]])
    }
};

export const sortedUpcoming = derived(communityEventsUpcoming, (v) => v.sort((a, b) => a[0] - b[0]))
export const sortedPast = derived(communityEventsPast, (v) => v.sort((a, b) => a[0] - b[0]))

export const chatStore = writable<string | undefined>(undefined);
export const chatCommentsStore = writable<NDKEvent[]>([]);

export const sortedComments = derived(chatCommentsStore, (v) => v.sort((a, b) => a.created_at && b.created_at ? b.created_at - a.created_at : -1))

export function addComment(s: NDKEvent){
    chatCommentsStore.update(
        items => {
            items.push(s)
            return [...new Map(items.map(v => [v.id, v])).values()]
        }
        
    )
};