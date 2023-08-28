
import { parseCommunityData, type CommunityMeta } from '$lib/community/community';
import { parseEventData, type EventMeta } from '$lib/event/event';
import type { NDKEvent } from '@nostr-dev-kit/ndk';
import { derived, writable } from 'svelte/store';

export const communityList = writable<Array<CommunityMeta>>([])
export const personList = writable<Array<NDKEvent>>([])
export const eventListUpcoming = writable<Array<EventMeta>>([])
export const eventListPast = writable<Array<EventMeta>>([])

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

export function addCommunity(e:NDKEvent){
    communityList.update(items => {
        let d = parseCommunityData(e)
        if(!d.image || d.image.length < 1) d.image = '/img/default.jpeg'
        items.push(d)
        return [...new Map(items.map(v => [v.eid, v])).values()]
    })
}
export function addEvent(e:NDKEvent){
    let d = parseEventData(e)
    if(d.status !=='draft'){
        if(d.ends > (Date.now() / 1000)){
            eventListUpcoming.update(items => {
                items.push(d)
                return [...new Map(items.map(v => [v.eid, v])).values()]
            })
        }
        else{
            eventListPast.update(items => {
                items.push(d)
                return [...new Map(items.map(v => [v.eid, v])).values()]
            })
        }
    }
}
export function addPerson(e:NDKEvent){
    personList.update(items => {
        items.push(e)
        return [...new Map(items.map(v => [v.pubkey, v])).values()]
    })
}

export const sortedUpcoming = derived(eventListUpcoming, (v) => v.sort((a, b) => a.starts - b.starts))
export const sortedPast = derived(eventListPast, (v) => v.sort((a, b) => a.ends - b.ends))
export const sortedCommunities = derived(communityList, (v) => v.sort((a, b) => b.updated - a.updated))