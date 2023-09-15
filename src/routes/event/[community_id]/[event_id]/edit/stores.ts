
import type { Community } from '$lib/community/community';
import type { MeetupEvent } from '$lib/event/event';
import ndk from '$lib/ndk';
import { writable } from 'svelte/store';

export const community = writable<Community>();

export const signalUpdMap = writable({});
//export const eventMetaStore = writable<EventMeta>({...EventMetaDefaults});

export const meetupStore = writable<MeetupEvent>();

