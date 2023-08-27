
import { EventMetaDefaults, type EventMeta } from '$lib/event/event';
import { writable } from 'svelte/store';

export const signalUpdMap = writable({});
export const eventMetaStore = writable<EventMeta>({...EventMetaDefaults});

