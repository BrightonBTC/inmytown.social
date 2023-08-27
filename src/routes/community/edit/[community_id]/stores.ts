import { CommunityMetaDefaults, type CommunityMeta } from '$lib/community/community';
import { writable } from 'svelte/store';

export const signalUpdMap = writable({});

export const communityMetaStore = writable<CommunityMeta>({...CommunityMetaDefaults});


