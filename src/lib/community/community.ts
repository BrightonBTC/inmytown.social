import { NDKEvent, type NDKFilter, type NDKFilterOptions, type NDKSubscriptionOptions } from "@nostr-dev-kit/ndk"
import type NDK from "@nostr-dev-kit/ndk"
import Geohash from "latlon-geohash"

export interface CommunityMeta{
    uid: string 
    eid: string
    author: string 
    authorhex: string 
    title: string
    content: string
    image?: string
    latitude: number
    longitude: number
    zoom: number
    country: string
    city: string
    tags: Array<string>
    updated: number
    created: number
    error?: string
}

export const CommunityMetaDefaults: Pick<CommunityMeta, 'uid' | 'eid' | 'title' | 'tags' | 'author' | 'authorhex' | 'latitude' | 'longitude' | 'zoom' | 'content' | 'image' | 'country' | 'city' | 'updated' | 'created'> = {
    uid: "",
    eid: "",
    title: "",
    tags: [],
    author: "",
    authorhex: "",
    latitude: 0,
    longitude: 0,
    zoom: 1,
    content: "",
    image: undefined,
    country: "",
    city: "",
    updated: 0,
    created: 0
};

export async function subCommunity(ndk: NDK, community_id: string, cb: (data: CommunityMeta) => void) {
    let community: CommunityMeta = {
        ...CommunityMetaDefaults,
        eid: community_id
    };
    try {
        const communitySub = ndk.subscribe(
            {
                kinds: [1037],
                "ids": [community_id],
            },
            {closeOnEose: false}
        );
        communitySub.on("event", (event: NDKEvent) =>  {
            community.created = event.created_at ? event.created_at : 0;
            subCommunityMeta(ndk, community, cb)
        });
    } catch (err) {
        console.log("An ERROR occured when subscribing to community", err);
    } 
}

export async function subCommunities(ndk: NDK, filter: NDKFilter, opts: NDKSubscriptionOptions, cb: (data: CommunityMeta) => void) {
    filter.kinds = [1037]
    try {
        const communitySub = ndk.subscribe(
            filter,
            opts
        );
        communitySub.on("event", (event: NDKEvent) =>  {
            let community: CommunityMeta = {
                ...CommunityMetaDefaults,
                eid: event.id,
                created: event.created_at ? event.created_at : 0
            };
            
            subCommunityMeta(ndk, community, cb)
        });
    } catch (err) {
        console.log("An ERROR occured when subscribing to community", err);
    } 
}


export async function subCommunityMeta(ndk: NDK, community: CommunityMeta, cb: (data: CommunityMeta) => void) {
    let lastUpdCommunity = 0;
    console.log('subCommunityMeta', community.eid)
    try {
        const communitySub = ndk.subscribe(
            {
                kinds: [30037],
                "#e": [community.eid],
            },
            {closeOnEose: false, groupable: false}
        );
        communitySub.on("event", (event: NDKEvent) =>  {
            console.log('community meta',event)
            if (event.created_at && event.created_at > lastUpdCommunity) {
                lastUpdCommunity = event.created_at;
                let meta = parseCommunityData(event)
                meta.created = community.created
                cb(meta);
            }
        });
    } catch (err) {
        console.log("An ERROR occured when subscribing to community", err);
    } 
}

export function parseCommunityData(communityDetails: NDKEvent){
    let meta: CommunityMeta = {
        ...CommunityMetaDefaults
    };
    meta.tags = [];
    meta.content = communityDetails.content
    meta.author = communityDetails.author.npub
    meta.authorhex = communityDetails.author.hexpubkey()
    if(communityDetails.created_at) meta.updated = communityDetails.created_at
    communityDetails.tags.forEach(function (itm) {
        switch (itm[0]) {
            case "title":
                meta.title = itm[1];
                break;
            case "banner":
                if(itm[1].length >0) meta.image = itm[1];
                break;
            case "zoom":
                meta.zoom = parseFloat(itm[1]);
                break;
            case "g":
                const g = Geohash.decode(itm[1]);
                meta.latitude = g.lat;
                meta.longitude = g.lon;
                break;
            case "t":
                meta.tags.push(itm[1]);
                break;
            case "c":
                let locationString = itm[1].trim();
                let locationParts = locationString.split(' ');
                meta.city = locationString.substring(0, locationString.length - 3);
                if(locationParts.length > 1) meta.country = locationParts[locationParts.length - 1];
                break;
            case "d":
                meta.uid = itm[1];
                break;
            case "e":
                meta.eid = itm[1];
                break;
        }
    });
    return meta;
}

export async function publishCommunityMeta(ndk: NDK, community: CommunityMeta){
    community = validateCommunityMeta(community)
    if(community.error) return community;
    try{
        const ndkEvent = new NDKEvent(ndk);
        ndkEvent.kind = 30037;
        ndkEvent.content = community.content;
        ndkEvent.tags = [
            ["title", community.title],
            ["d", community.uid],
            ["e", community.eid],
        ];
        if(community.image){
            ndkEvent.tags.push(["banner", community.image])
        }
        if(community.latitude && community.longitude && community.zoom){
            ndkEvent.tags.push(
                ["g", Geohash.encode(community.latitude, community.longitude)],
                ["zoom", community.zoom.toFixed(2)]
            );

            if(community.country && community.country.length > 0 && community.city && community.city.length > 0){
                ndkEvent.tags.push(["c", community.city + ' ' + community.country]);
            }
        }        
        
        if (community.tags.length > 0) {
            community.tags.forEach(function (t) {
                ndkEvent.tags.push(["t", t]);
            });
        }
        await ndkEvent.publish();
    }catch (err) {
        community.error = "An ERROR occured publishing the community metadata:"+ err;
    } finally {
        return community;
    }
}

export function validateCommunityMeta(community: CommunityMeta){
    if(community.title.length < 1){
        community.error = 'Missing title';
    }
    else if(community.content.length < 1){
        community.error = 'Missing description';
    }
    else{
        community.error = undefined;
    }
    return community;
}