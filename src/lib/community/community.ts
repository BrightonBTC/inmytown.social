import { NDKEvent, NDKSubscription, type NDKFilter, type NDKSubscriptionOptions, NDKUser } from "@nostr-dev-kit/ndk"
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
    country: string
    city: string
    tags: Array<string>
    updated: number
    created: number
    error?: string
}

export const CommunityMetaDefaults: Pick<CommunityMeta, 'uid' | 'eid' | 'title' | 'tags' | 'author' | 'authorhex' | 'latitude' | 'longitude' | 'content' | 'image' | 'country' | 'city' | 'updated' | 'created'> = {
    uid: "",
    eid: "",
    title: "",
    tags: [],
    author: "",
    authorhex: "",
    latitude: 0,
    longitude: 0,
    content: "",
    image: undefined,
    country: "",
    city: "",
    updated: 0,
    created: 0
};

export class Community {
    public ndk: NDK;
    public meta: CommunityMeta;
    private membersSubscription?: NDKSubscription;

    public constructor(ndk: NDK, meta?: CommunityMeta){
        this.ndk = ndk
        this.meta = {
            ...CommunityMetaDefaults,
            ...meta
        }
    }

    public async create(){
        const ndkEvent = new NDKEvent(this.ndk);
		ndkEvent.kind = 1037;
		await ndkEvent.publish();
        this.meta.eid = ndkEvent.id;
        this.meta.uid = ndkEvent.id;
        return ndkEvent.created_at;
    }

    public async createChat(){
        const ndkEvent = new NDKEvent(this.ndk);
        ndkEvent.kind = 40;
        ndkEvent.tags.push(["e", this.meta.eid])
        ndkEvent.content = JSON.stringify({
            name: this.meta.title,
            about: 'Public channel for meetup group: '+this.meta.title,
            picture: this.meta.image
        })
        await ndkEvent.publish();
    }

    public newUID(){
        this.meta.uid = parseInt((Date.now() / 1000).toString()).toString()
    } 

    public async publishMeta(){
        try{
            const ndkEvent = new NDKEvent(this.ndk);
            ndkEvent.kind = 30037;
            ndkEvent.content = this.meta.content;
            ndkEvent.tags = [
                ["title", this.meta.title],
                ["d", this.meta.uid],
                ["e", this.meta.eid],
            ];
            if(this.meta.image){
                ndkEvent.tags.push(["image", this.meta.image])
            }
            if(this.meta.latitude && this.meta.longitude){
                ndkEvent.tags.push(
                    ["g", Geohash.encode(this.meta.latitude, this.meta.longitude), 'geohash']
                );
            }     
            if(this.meta.country && this.meta.country.length > 0 && this.meta.city && this.meta.city.length > 0){
                ndkEvent.tags.push(["g", this.meta.country + ':' + this.meta.city, 'city']);
            }   
            
            if (this.meta.tags.length > 0) {
                this.meta.tags.forEach(function (t) {
                    ndkEvent.tags.push(["t", t]);
                });
            }
            await ndkEvent.publish();
        } catch (err) {
            this.meta.error = "An ERROR occured publishing the community metadata:"+ err;
        }
    }

    public validate(){
        if(this.meta.title.length < 1){
            this.meta.error = 'Missing title';
        }
        else if(this.meta.content.length < 1){
            this.meta.error = 'Missing description';
        }
        else{
            this.meta.error = undefined;
        }
    }


    public static parseNostrEvent(communityDetails: NDKEvent, meta?: CommunityMeta){
        if(!meta){
            meta = {
                ...CommunityMetaDefaults
            };
        }
        meta.tags = [];
        meta.content = communityDetails.content
        meta.author = communityDetails.author.npub
        meta.authorhex = communityDetails.author.hexpubkey()
        if(communityDetails.created_at) meta.updated = communityDetails.created_at
        communityDetails.tags.forEach(function (itm) {
            if(!meta) return;
            switch (itm[0]) {
                case "title":
                    meta.title = itm[1];
                    break;
                case "image":
                    if(itm[1].length >0) meta.image = itm[1];
                    break;
                case "g":
                    if(itm[2] === 'geohash'){
                        const g = Geohash.decode(itm[1]);
                        meta.latitude = g.lat;
                        meta.longitude = g.lon;
                    }
                    else if(itm[2] === 'city'){
                        const locationParts = itm[1].split(':')
                        meta.country = locationParts[0]
                        meta.city = locationParts[1]
                    }
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

    public static url(community: CommunityMeta){
        return '/community/'+community.eid
    }

    public async fetchMembers(cb: (user: NDKUser) => void){
        if(this.membersSubscription) return;
        try {
            this.membersSubscription = this.ndk.subscribe(
                {
                    kinds: [10037],
                    "#e": [this.meta.eid],
                },
                {closeOnEose: false, groupable: false}
            );
            this.membersSubscription.on("event", (event: NDKEvent) => {
                cb(event.author)
            });
        } catch (err) {
            console.log("An ERROR occured", err);
        }
    }

    public destroy(){
        if(this.membersSubscription) this.membersSubscription.stop()
    }
}

export class CommunitySubscriptions {
    public ndk: NDK;
    private subscriptions: NDKSubscription[] = [];

    public constructor(ndk: NDK){
        this.ndk = ndk
    }

    public async subscribeByID(community_id: string, cb: (data: CommunityMeta) => void, opts?: NDKSubscriptionOptions){
        let community: CommunityMeta = {
            ...CommunityMetaDefaults,
            eid: community_id
        };
        try {
            let communitySub = this.ndk.subscribe(
                {
                    kinds: [1037],
                    "ids": [community_id],
                },
                opts
            );
            if(opts && opts.closeOnEose === false){
                this.subscriptions.push(communitySub)
            }
            communitySub.on("event", (event: NDKEvent) =>  {
                community.created = event.created_at ? event.created_at : 0;
                this.subscribeMeta(community, cb)
            });
        } catch (err) {
            console.log("An ERROR occured when subscribing to community", err);
        } 
    }

    public async subscribe(filter: NDKFilter, cb: (data: CommunityMeta) => void, opts?: NDKSubscriptionOptions){
        filter.kinds = [1037]
        try {
            const communitiesSub = this.ndk.subscribe(
                filter,
                opts
            );
            if(opts && opts.closeOnEose === false){
                this.subscriptions.push(communitiesSub)
            }
            communitiesSub.on("event", (event: NDKEvent) =>  {
                let community: CommunityMeta = {
                    ...CommunityMetaDefaults,
                    eid: event.id,
                    created: event.created_at ? event.created_at : 0
                };
                this.subscribeMeta(community, cb)
            });
        } catch (err) {
            console.log("An ERROR occured when subscribing to community", err);
        } 
    }

    public async subscribeMeta(community: CommunityMeta, cb: (data: CommunityMeta) => void){
        let lastUpdCommunity = 0;
        try {
            const communityMetaSub = this.ndk.subscribe(
                {
                    kinds: [30037],
                    "#e": [community.eid],
                }
            );
            communityMetaSub.on("event", (event: NDKEvent) =>  {
                if (event.created_at && event.created_at > lastUpdCommunity) {
                    lastUpdCommunity = event.created_at;
                    let meta = Community.parseNostrEvent(event, community)
                    cb(meta);
                }
            });
        } catch (err) {
            console.log("An ERROR occured when subscribing to community", err);
        } 
    }

    public async subscribeMetaMulti(filter: NDKFilter, cb: (data: CommunityMeta) => void, opts?: NDKSubscriptionOptions){
        filter.kinds = [30037]
        try {
            const sub = this.ndk.subscribe(
                filter,
                opts
            );
            if(opts && opts.closeOnEose === false){
                this.subscriptions.push(sub)
            }
            sub.on("event", (event: NDKEvent) =>  {
                let meta = Community.parseNostrEvent(event)
                cb(meta);
            });
        } catch (err) {
            console.log("An ERROR occured when subscribing to community", err);
        } 
    }

    public closeSubscriptions(){
        this.subscriptions.forEach(function(sub){
            sub.stop()
        })
    }
}

