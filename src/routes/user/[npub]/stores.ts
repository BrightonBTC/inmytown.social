import { type CommunityMeta, Community } from '$lib/community/community';
import type { NDKEvent, NDKUser } from '@nostr-dev-kit/ndk';
import { derived, writable } from 'svelte/store';

export const communitiesStore = writable<Array<CommunityMeta>>([]);

export const sortedCommunities = derived(communitiesStore, (v) => v.sort((a, b) => b.updated - a.updated))

export function addCommunity(e:NDKEvent){
    communitiesStore.update(items => {
        let d = Community.parseNostrEvent(e)
        if(!d.image || d.image.length < 1) d.image = '/img/default.jpeg'
        items.push(d)
        return [...new Map(items.map(v => [v.eid, v])).values()]
    })
}

export const currentUserFollows = writable<NDKUser[]>([]);

export function addFollow(u:NDKUser){
    currentUserFollows.update(items => {
        items.push(u)
        return [...new Map(items.map(v => [v.npub, v])).values()]
    })
}

export function removeFollow(npub:string){
    currentUserFollows.update(items => items.filter((v) => v.npub !== npub))
}

export const currentUserFollowsNpubs = derived(currentUserFollows, f => f.map(u => u.npub))
export const currentUserFollowsHexs = derived(currentUserFollows, f => f.map(u => u.hexpubkey()))