import { CommunityMetaDefaults, type CommunityMeta, Community, CommunitySubscriptions } from "$lib/community/community"
import NDK, { NDKEvent, NDKSubscription, type NDKFilter, type NDKSubscriptionOptions } from "@nostr-dev-kit/ndk"
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
    updated: number
    created: number
}

export const EventMetaDefaults: Pick<EventMeta, 'uid' | 'eid' | 'title' | 'brief' | 'tags' | 'author' | 'authorhex' | 'latitude' | 'longitude' | 'content' | 'image' | 'country' | 'city' |  'venue' | 'starts' | 'ends' | 'community' | 'status' | 'updated' | 'created'> = {
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
    updated: 0,
    created: 0
};

export class MeetupEvent {
    public ndk: NDK;
    public meta: EventMeta;
    public error?: string;
    private rsvpSubscription?: NDKSubscription;

    public constructor(ndk: NDK, meta?: EventMeta){
        this.ndk = ndk
        this.meta = {
            ...EventMetaDefaults,
            ...meta
        }
    }

    public async fetchCommunity(){
        const sub = new CommunitySubscriptions(this.ndk);
        const that = this
        await sub.subscribeByID(this.meta.community.eid, (data) => {
            that.meta.community = data
        })
    }


    public static async create(ndk: NDK, community: CommunityMeta){
        const event = new NDKEvent(ndk);
        event.kind = 1073;
        event.tags = [["e", community.eid]];
        await event.publish();
        let meta = {
            ...EventMetaDefaults,
            eid: event.id,
            uid: event.id,
            community: community,
        }
        meta.latitude = community.latitude;
        meta.longitude = community.longitude;
        meta.city = community.city;
        meta.country = community.country;
        return new MeetupEvent(ndk, meta);
    }


    public async fetchRSVPs(cb: (data: NDKEvent) => void){
        try {
            this.rsvpSubscription = this.ndk.subscribe(
                {
                    kinds: [30042],
                    "#d": [this.meta.eid],
                },
                {
                    closeOnEose: false,
                }
            );
            this.rsvpSubscription.on("event", (event: NDKEvent) => {
                cb(event)
            });
        } catch (err) {
            console.log("An ERROR occured", err);
        }
    }

    public async rsvp(state:string){
        const ndkEvent = new NDKEvent(this.ndk);
        ndkEvent.kind = 30038;
        ndkEvent.tags = [
            ["rsvp", state],
            ["d", this.meta.eid]
        ];
        await ndkEvent.publish();
    }

    public async publish(){
        this.error = undefined;
        try {
            const ndkEvent = new NDKEvent(this.ndk);
            ndkEvent.kind = 30073;
            ndkEvent.content = this.meta.content;
            ndkEvent.tags = [
                ["title", this.meta.title],
                ["brief", this.meta.brief],
                ["d", this.meta.uid],
                ["e", this.meta.eid],
                ["e", this.meta.community.eid],
                ["starts", this.meta.starts.toString()],
                ["ends", this.meta.ends.toString()],
                ["status", this.meta.status]
            ];
            if(this.meta.image){
                ndkEvent.tags.push(["image", this.meta.image])
            }
            if(this.meta.latitude && this.meta.longitude){
                ndkEvent.tags.push(
                    ["g", Geohash.encode(this.meta.latitude, this.meta.longitude)],
                );
            }
            if(this.meta.city && this.meta.city.length > 0 && this.meta.country && this.meta.country.length > 0){
                ndkEvent.tags.push(["c", this.meta.city + ' ' + this.meta.country]);
            }
            if(this.meta.venue && this.meta.venue.length > 0){
                ndkEvent.tags.push(["venue", this.meta.venue]);
            }
            if (this.meta.tags.length > 0) {
                this.meta.tags.forEach(function (t) {
                    ndkEvent.tags.push(["t", t]);
                });
            }
            await ndkEvent.publish();
        } catch (err) {
            this.error = "An ERROR occured publishing the event metadata:"+ err;
        }
    }

    public static parseNostrEvent(data: NDKEvent, meta?:EventMeta){
        if(!meta){
            meta = {
                ...EventMetaDefaults,
                community: {
                    ...CommunityMetaDefaults
                }
            };
        }
        meta.tags = [];
        meta.content = data.content
        meta.updated = data.created_at || -1
        meta.author = data.author.npub
        meta.authorhex = data.author.hexpubkey()
        let etags = data.tags.filter(t => t[0] === 'e')
        if(etags.length > 0) meta.eid = etags[0][1]
        if(etags.length > 1) meta.community.eid = etags[1][1]
        data.tags.forEach(function (itm) {
            if(!meta) return;
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

    public destroy(){
        if(this.rsvpSubscription) this.rsvpSubscription.stop()
    }
}

export class EventSubscriptions {
    public ndk: NDK;
    private subscriptions: NDKSubscription[] = [];

    public constructor(ndk: NDK){
        this.ndk = ndk
    }

    public async subscribeByID(id: string, cb: (data: EventMeta) => void, opts?: NDKSubscriptionOptions){
        let meta: EventMeta = {
            ...EventMetaDefaults,
            eid: id
        };
        try {
            let communitySub = this.ndk.subscribe(
                {
                    kinds: [1073],
                    "ids": [id],
                },
                opts
            );
            if(opts && opts.closeOnEose === false){
                this.subscriptions.push(communitySub)
            }
            communitySub.on("event", (event: NDKEvent) =>  {
                meta.created = event.created_at ? event.created_at : 0;
                this.subscribeMeta(meta, cb)
            });
        } catch (err) {
            console.log("An ERROR occured when subscribing to event", err);
        } 
    }

    public async subscribe(filter: NDKFilter, cb: (data: EventMeta) => void, opts?: NDKSubscriptionOptions){
        filter.kinds = [1073]
        try {
            const sub = this.ndk.subscribe(
                filter,
                opts
            );
            if(opts && opts.closeOnEose === false){
                this.subscriptions.push(sub)
            }
            sub.on("event", (event: NDKEvent) =>  {
                let meta: EventMeta = {
                    ...EventMetaDefaults,
                    eid: event.id,
                    created: event.created_at ? event.created_at : 0
                };
                
                this.subscribeMeta(meta, cb)
            });
        } catch (err) {
            console.log("An ERROR occured when subscribing to events", err);
        } 
    }

    public async subscribeMeta(meta: EventMeta, cb: (data: EventMeta) => void) {
        let lastUpd = 0
        try {
            const communitySub = this.ndk.subscribe(
                { kinds: [30073], "#e": [meta.eid] }
            );
            communitySub.on("event", (event: NDKEvent) =>  {
                if(event.created_at && event.created_at > lastUpd){
                    lastUpd = event.created_at
                    cb(MeetupEvent.parseNostrEvent(event, meta))
                }
            });
        } catch (err) {
            console.log("An ERROR occured when subscribing to community", err);
        } 
    }

    public async subscribeMetaMulti(filter: NDKFilter, cb: (data: EventMeta) => void, opts?: NDKSubscriptionOptions){
        filter.kinds = [30073]
        try {
            const sub = this.ndk.subscribe(
                filter,
                opts
            );
            if(opts && opts.closeOnEose === false){
                this.subscriptions.push(sub)
            }
            sub.on("event", (event: NDKEvent) =>  {
                cb(MeetupEvent.parseNostrEvent(event))
            });
        } catch (err) {
            console.log("An ERROR occured when subscribing to events", err);
        } 
    }

    public closeSubscriptions(){
        this.subscriptions.forEach(function(sub){
            sub.stop()
        })
    }
}



// export async function subEventMeta(ndk: NDK, eid: string, cb: (data: EventMeta) => void) {
//     let lastUpd = 0
//     try {
//         const communitySub = ndk.subscribe(
//             { kinds: [30073], "#e": [eid] }
//         );
//         communitySub.on("event", (event: NDKEvent) =>  {
//             if(event.created_at && event.created_at > lastUpd){
//                 lastUpd = event.created_at
//                 cb(parseEventData(event))
//             }
//         });
//     } catch (err) {
//         console.log("An ERROR occured when subscribing to community", err);
//     } 
// }



// export function parseEventData(data: NDKEvent){
//     let meta: EventMeta = {
//         ...EventMetaDefaults,
//         community: {
//             ...CommunityMetaDefaults
//         }
//     };
//     meta.tags = [];
//     meta.content = data.content
//     meta.updated = data.created_at || -1
//     meta.author = data.author.npub
//     meta.authorhex = data.author.hexpubkey()
//     let etags = data.tags.filter(t => t[0] === 'e')
//     if(etags.length > 0) meta.eid = etags[0][1]
//     if(etags.length > 1) meta.community.eid = etags[1][1]
//     data.tags.forEach(function (itm) {
//         switch (itm[0]) {
//             case "title":
//                 meta.title = itm[1];
//                 break;
//             case "brief":
//                 meta.brief = itm[1];
//                 break;
//             case "image":
//                 meta.image = itm[1];
//                 break;
//             case "g":
//                 const g = Geohash.decode(itm[1]);
//                 meta.latitude = g.lat;
//                 meta.longitude = g.lon;
//                 break;
//             case "t":
//                 meta.tags.push(itm[1]) ;
//                 break;
//             case "c":
//                 let locationString = itm[1].trim();
//                 let locationParts = locationString.split(' ');
//                 meta.city = locationString.substring(0, locationString.length - 3);
//                 if(locationParts.length > 1) meta.country = locationParts[locationParts.length - 1];
//                 break;
//             case "venue":
//                 meta.venue = itm[1];
//                 break;
//             case "d":
//                 meta.uid = itm[1];
//                 break;
//             case "starts":
//                 meta.starts = parseInt(itm[1]);
//             break;
//             case "ends":
//                 meta.ends = parseInt(itm[1]);
//             break;
//             case "status":
//                 meta.status = itm[1];
//             break;
//         }
//     });
//     return meta;
// }

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