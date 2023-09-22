import type { CommunityMeta } from '$lib/community/community';
import type { MeetupUser } from '$lib/user/user';
import type { NDKUser } from '@nostr-dev-kit/ndk';
import { derived, writable } from 'svelte/store';

export const meetupUser = writable<MeetupUser>()

export const editStatus = writable<Boolean>(false)

export const communitiesStore = writable<Array<CommunityMeta>>([]);

export const sortedCommunities = derived(communitiesStore, (v) => v.sort((a, b) => b.updated - a.updated))

export function addCommunity(community:CommunityMeta){
    communitiesStore.update(items => {
        items.push(community)
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