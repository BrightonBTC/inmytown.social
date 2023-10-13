
import type { Community } from '$lib/community/community';
import type { NDKUser } from '@nostr-dev-kit/ndk';
import { writable } from 'svelte/store';

export const host = writable<NDKUser | undefined>();
export const community = writable<Community>();
export const membersFetched = writable<boolean>(false);

