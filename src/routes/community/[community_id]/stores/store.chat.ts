import type { NDKEvent } from "@nostr-dev-kit/ndk";
import { derived, writable } from "svelte/store";

export const chatStore = writable<string | undefined>(undefined);
export const chatFilter = writable<number>(1);
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