import { derived, writable } from 'svelte/store';


export const attendeeStore = writable<Array<[string, string]>>([]);

export function addAttendee(npub: string, rsvp: string){
    attendeeStore.update(items => {
        items.push([npub, rsvp])
        return [...new Map(items.map(v => [v[0], v])).values()]
    })
}

export const attendees = derived(attendeeStore, (v) => v.filter((a) => a[1] === 'going'))
export const notgoing = derived(attendeeStore, (v) => v.filter((a) => a[1] === 'not'))
export const interested = derived(attendeeStore, (v) => v.filter((a) => a[1] === 'interested'))