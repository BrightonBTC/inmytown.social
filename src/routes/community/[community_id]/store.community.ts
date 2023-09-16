
import type { Community } from '$lib/community/community';
import { writable } from 'svelte/store';

export const community = writable<Community>();

export const communityMembers = writable<string[]>([]);

export function addMember(s: string){
    communityMembers.update(items => {
        items.push(s)
        return [...new Map(items.map(v => [v, v])).values()]
    })
};

export function removeMember(s: string){
    communityMembers.update(items => items.filter((itm) => itm !== s))
};

