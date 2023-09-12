
import type { CommunityMeta } from '$lib/community/community';
import type { EventMeta } from '$lib/event/event';
import type { NDKEvent } from '@nostr-dev-kit/ndk';
import { derived, writable } from 'svelte/store';

export const communityList = writable<Array<CommunityMeta>>([])
export const personList = writable<Array<NDKEvent>>([])
export const eventList = writable<Array<EventMeta>>([])

export const searchType = writable("communities")

export const topics = writable<Array<string>>([]);

export function addTopic(tag: string){
    topics.update(items => {
        items.push(tag)
        return [...new Map(items.map(v => [v, v])).values()]
    })
}

export function removeTopic(tag:string){

    topics.update(items => {
        return items.filter((t) => t !== tag)
    })
}


export function addCommunity(e:CommunityMeta){
    communityList.update(items => {
        items.push(e)
        return [...new Map(items.map(v => [v.eid, v])).values()]
    })
}

export function addEvent(event:EventMeta){
    if(event.status !=='draft'){
        eventList.update(items => {
            let dupes = items.filter(x => x.uid === event.uid);
            if(dupes.length === 0 || dupes[0].updated < event.updated){
                items.push(event)
            }
            return [...new Map(items.map(v => [v.eid, v])).values()]
        })
    }
}

export function addPerson(e:NDKEvent){
    personList.update(items => {
        items.push(e)
        return [...new Map(items.map(v => [v.pubkey, v])).values()]
    })
}

export const eventListUpcoming = derived(eventList, (v) => v.filter(x => x.ends > (Date.now() / 1000)))
export const eventListPast = derived(eventList, (v) => v.filter(x => x.ends <= (Date.now() / 1000)))

export const sortedUpcoming = derived(eventListUpcoming, (v) => v.sort((a, b) => a.starts - b.starts))
export const sortedPast = derived(eventListPast, (v) => v.sort((a, b) => a.ends - b.ends))
export const sortedCommunities = derived(communityList, (v) => v.sort((a, b) => b.updated - a.updated))