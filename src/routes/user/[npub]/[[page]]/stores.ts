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
