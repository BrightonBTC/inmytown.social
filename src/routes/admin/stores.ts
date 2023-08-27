
import { parseCommunityData, type CommunityMeta } from '$lib/community/community';
import type { NDKEvent } from '@nostr-dev-kit/ndk';
import { derived, writable } from 'svelte/store';

//export const communitiesStore = writable<Array<[string, string]>>([]);
export const communitiesStore = writable<Array<CommunityMeta>>([]);

export const sortedCommunities = derived(communitiesStore, (v) => v.sort((a, b) => b.updated - a.updated))

export function addCommunity(e:NDKEvent){
    communitiesStore.update(items => {
        let d = parseCommunityData(e)
        if(!d.image || d.image.length < 1) d.image = '/img/default.jpeg'
        items.push(d)
        return [...new Map(items.map(v => [v.eid, v])).values()]
    })
}
