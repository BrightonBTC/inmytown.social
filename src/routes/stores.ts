import type { NDKEvent } from "@nostr-dev-kit/ndk";
import { derived, writable } from "svelte/store";

export const communities = writable<Array<NDKEvent>>([]);
export const events = writable<Array<NDKEvent>>([]);

export function addCommunity(e: NDKEvent){
    communities.update(items => {
        items.push(e)
        return [...new Map(items.map(v => [v.id, v])).values()]
    })
}
export const sortedCommunities = derived(communities, (v) => v.sort((a, b) => b.created_at && a.created_at ? b.created_at - a.created_at: 0))

export function addEvent(e: NDKEvent){
    events.update(items => {
        items.push(e)
        return [...new Map(items.map(v => [v.id, v])).values()]
    })
}
export const sortedEvents = derived(events, (v) => v.sort((a, b) => b.created_at && a.created_at ? b.created_at - a.created_at: 0))