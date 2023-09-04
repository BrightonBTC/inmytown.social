import { CommunityMetaDefaults, type CommunityMeta } from "$lib/community/community"
import NDK, { NDKEvent } from "@nostr-dev-kit/ndk"
import Geohash from "latlon-geohash"

export interface EventMeta{
    uid: string 
    eid: string 
    author: string 
    authorhex: string 
    title: string
    content: string
    brief: string
    image: string
    latitude: number
    longitude: number
    country: string
    city: string
    venue: string
    tags: Array<string>
    starts: number
    ends: number
    community: CommunityMeta
    status: string
    created_at: number
}

export const EventMetaDefaults: Pick<EventMeta, 'uid' | 'eid' | 'title' | 'brief' | 'tags' | 'author' | 'authorhex' | 'latitude' | 'longitude' | 'content' | 'image' | 'country' | 'city' |  'venue' | 'starts' | 'ends' | 'community' | 'status' | 'created_at'> = {
    uid: "",
    eid: "",
    title: "Draft event",
    brief: "",
    tags: [],
    author: "",
    authorhex: "",
    latitude: 0,
    longitude: 0,
    content: "",
    image: "",
    country: "",
    city: "",
    venue: "",
    starts: 0,
    ends: 0,
    community: CommunityMetaDefaults,
    status: "draft",
    created_at: 0
};

// export async function subEvent(ndk: NDK, id: string, cb: (data: EventMeta) => void) {
    
//     try {
//         const communitySub = ndk.subscribe(
//             {
//                 ids:[id],
//             },
//             {
//                 closeOnEose: false,
//             }
//         );
//         communitySub.on("event", (event: NDKEvent) =>  {
//             subEventMeta(ndk, id, cb)
//         });
//     } catch (err) {
//         console.log("An ERROR occured when subscribing to community", err);
//     } 
// }
export async function subEventMeta(ndk: NDK, eid: string, cb: (data: EventMeta) => void) {
    let lastUpd = 0
    try {
        const communitySub = ndk.subscribe(
            { kinds: [30073], "#e": [eid] },
            {
                closeOnEose: false,
            }
        );
        communitySub.on("event", (event: NDKEvent) =>  {
            if(event.created_at && event.created_at > lastUpd){
                lastUpd = event.created_at
                cb(parseEventData(event))
            }
        });
    } catch (err) {
        console.log("An ERROR occured when subscribing to community", err);
    } 
}



export function parseEventData(data: NDKEvent){
    let meta: EventMeta = {
        ...EventMetaDefaults,
        community: {
            ...CommunityMetaDefaults
        }
    };
    meta.tags = [];
    meta.content = data.content
    meta.created_at = data.created_at || -1
    meta.author = data.author.npub
    meta.authorhex = data.author.hexpubkey()
    let etags = data.tags.filter(t => t[0] === 'e')
    if(etags.length > 0) meta.eid = etags[0][1]
    if(etags.length > 1) meta.community.eid = etags[1][1]
    data.tags.forEach(function (itm) {
        switch (itm[0]) {
            case "title":
                meta.title = itm[1];
                break;
            case "brief":
                meta.brief = itm[1];
                break;
            case "image":
                meta.image = itm[1];
                break;
            case "g":
                const g = Geohash.decode(itm[1]);
                meta.latitude = g.lat;
                meta.longitude = g.lon;
                break;
            case "t":
                meta.tags.push(itm[1]) ;
                break;
            case "c":
                let locationString = itm[1].trim();
                let locationParts = locationString.split(' ');
                meta.city = locationString.substring(0, locationString.length - 3);
                if(locationParts.length > 1) meta.country = locationParts[locationParts.length - 1];
                break;
            case "venue":
                meta.venue = itm[1];
                break;
            case "d":
                meta.uid = itm[1];
                break;
            case "starts":
                meta.starts = parseInt(itm[1]);
            break;
            case "ends":
                meta.ends = parseInt(itm[1]);
            break;
            case "status":
                meta.status = itm[1];
            break;
        }
    });
    return meta;
}

export async function publishEventMeta(ndk: NDK, data: EventMeta){
    let response: NDKEvent | string | null = null;
    try {
        const ndkEvent = new NDKEvent(ndk);
        ndkEvent.kind = 30073;
        ndkEvent.content = data.content;
        ndkEvent.tags = [
			["title", data.title],
			["brief", data.brief],
			["d", data.uid],
			["e", data.eid],
			["e", data.community.eid],
			["starts", data.starts.toString()],
			["ends", data.ends.toString()],
			["status", data.status]
		];
        if(data.image){
            ndkEvent.tags.push(["image", data.image])
        }
        if(data.latitude && data.longitude){
            ndkEvent.tags.push(
                ["g", Geohash.encode(data.latitude, data.longitude)],
            );
        }
        // if(data.country && data.country.length > 0){
        //     ndkEvent.tags.push(["n", data.country]);
        // }
        if(data.city && data.city.length > 0 && data.country && data.country.length > 0){
            ndkEvent.tags.push(["c", data.city + ' ' + data.country]);
        }
        if(data.venue && data.venue.length > 0){
            ndkEvent.tags.push(["venue", data.venue]);
        }
        if (data.tags.length > 0) {
			data.tags.forEach(function (t) {
				ndkEvent.tags.push(["t", t]);
			});
		}
        await ndkEvent.publish();
        response = ndkEvent;
    } catch (err) {
        response = "An ERROR occured publishing the event metadata:"+ err;
    } finally {
        return response;
    }
}