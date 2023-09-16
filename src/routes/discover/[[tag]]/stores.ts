
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


export function addCommunity(item: CommunityMeta) {
    communityList.update((items) => {
        let matches = items.filter(v => v.uid === item.uid && v.author === item.author)
        if(matches.length > 0){
            if(matches[0].updated < item.updated){
                items = items.filter(v => v.uid !== item.uid && v.author !== item.author)
                items.push(item)
            }
        }
        else{
            items.push(item)
        }
        return items
    });
  }

export function addEvent(item:EventMeta){
    if(item.status !=='draft'){
        eventList.update(items => {
            let matches = items.filter(v => v.uid === item.uid && v.author === item.author)
            if(matches.length > 0){
                if(matches[0].updated < item.updated){
                    items = items.filter(v => v.uid !== item.uid && v.author !== item.author)
                    items.push(item)
                }
            }
            else{
                items.push(item)
            }
            return items
        })
    }
}

export function addPerson(item:NDKEvent){
    personList.update(items => {
        let matches = items.filter(v => v.author === item.author)
        if(matches.length > 0){
            if(matches[0].created_at && item.created_at && matches[0].created_at < item.created_at){
                items = items.filter(v => v.author !== item.author)
                items.push(item)
            }
        }
        else{
            items.push(item)
        }
        return items
    })
}

export const eventListUpcoming = derived(eventList, (v) => v.filter(x => x.ends > (Date.now() / 1000)))
export const eventListPast = derived(eventList, (v) => v.filter(x => x.ends <= (Date.now() / 1000)))

export const sortedUpcoming = derived(eventListUpcoming, (v) => v.sort((a, b) => a.starts - b.starts))
export const sortedPast = derived(eventListPast, (v) => v.sort((a, b) => a.ends - b.ends))
export const sortedCommunities = derived(communityList, (v) => v.sort((a, b) => b.updated - a.updated))