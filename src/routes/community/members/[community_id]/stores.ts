import type { Community } from '$lib/community/community';
import { writable } from 'svelte/store';

export const community = writable<Community>();

