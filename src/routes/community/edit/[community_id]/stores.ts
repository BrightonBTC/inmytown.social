import { Community } from '$lib/community/community';
import ndk from '$lib/ndk';
import { writable } from 'svelte/store';

export const signalUpdMap = writable({});

export const community = writable<Community>(new Community(ndk));



