import { MeetupUser } from "$lib/user/user"
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

interface UserList{
    members?: string[]
    followers?: string[]
    blocked?: string[]
    stale?: string[]
}

export class Community {
    public ndk: NDK;
    public meta: CommunityMeta;
    public users:UserList = {}
    private membersSubscription?: NDKSubscription;

    public constructor(ndk: NDK, meta?: CommunityMeta){
        this.ndk = ndk
        this.meta = {
            ...CommunityMetaDefaults,
            ...meta
        }
    }

    public async fetchMeta(id?: string): Promise<CommunityMeta | null> {
        if (!id && this.meta.eid.length < 1){
            return null
        } 
        else if (!id){
            id = this.meta.eid
        } 
        let community = await this.ndk.fetchEvent(id)
        if(!community) return null
        let events = await this.ndk.fetchEvents({ '#e': [id], kinds: [30037], authors: [community.author.hexpubkey()] });
        if (events.size > 0 ) {
            const mostRecent = [...events].reduce((max, obj) =>
                obj.created_at && max.created_at && obj.created_at > max.created_at ? obj : max,
                [...events][0]
            );
            this.meta = Community.parseNostrEvent(mostRecent)
            return this.meta
        }
        return null
    }

    public async create(): Promise<number | undefined>{
        try{
            const ndkEvent = new NDKEvent(this.ndk);
            ndkEvent.kind = 1037;
            await ndkEvent.publish();
            this.meta.eid = ndkEvent.id;
            this.meta.uid = ndkEvent.id;
            this.meta.authorhex = ndkEvent.author.hexpubkey()
            return ndkEvent.created_at;
        }
        catch(error){
            console.log('An error occurred creating the community: '+error)
        }
    }

    public async createChat(): Promise<void>{
        try{
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
        catch(error){
            console.log('An error occurred creating the chat: '+error)
        }
    }

    public async createApprovedMemberList(): Promise<void>{
        try{
            const ndkEvent = new NDKEvent(this.ndk);
            ndkEvent.kind = 30000;
            ndkEvent.tags.push(["d", this.meta.uid])
            ndkEvent.tags.push(["p", this.meta.authorhex])
            await ndkEvent.publish();
        }
        catch(error){
            console.log('An error occurred creating the chat: '+error)
        }
    }

    public newUID(){
        this.meta.uid = 'meetup:'+parseInt((Date.now() / 1000).toString()).toString()
    } 

    public async publishMeta(): Promise<void>{
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

    public async fetchMembers(): Promise<void> {
        if (this.meta.uid.length < 1) {
            return;
        }

        try {
            const [blockedUsers, followers, approvedMembers] = await Promise.all([
                this.fetchBlockedUsers(),
                this.fetchFollowers(),
                this.fetchApprovedMembers(),
            ]);

            this.users.blocked = blockedUsers;

            const filteredFollowers = followers.filter((member) => !blockedUsers.includes(member));

            const filteredMembers = approvedMembers.filter((member) => !blockedUsers.includes(member));

            this.users.members = filteredMembers.filter((member) => filteredFollowers?.includes(member));

            this.users.stale = filteredMembers.filter((member) => !filteredFollowers?.includes(member));

            this.users.followers = filteredFollowers.filter((follower) => !filteredMembers.includes(follower));

        } catch (error) {
            console.log('An error fetching members: ' + error);
        }
    }

    public async fetchFollowers(): Promise<string[]> {
        try {
            const response = await this.ndk.fetchEvents({
                kinds: [10037],
                "#e": [this.meta.eid],
            });

            // Convert the Set to an array
            const responseArray = [...response];

            return responseArray.map((evt) => evt.author.npub);
        } catch (error) {
            console.log('An error fetching follower list: ' + error);
            return [];
        }
    }

    public async fetchApprovedMembers(): Promise<string[]> {
        try {
            const response = await this.ndk.fetchEvents({
                kinds: [30000],
                "#d": [this.meta.uid],
                authors: [this.meta.authorhex],
            });

            // Convert the Set to an array
            const responseArray = [...response];

            const mostRecent = responseArray.reduce((max, obj) =>
                obj.created_at && max.created_at && obj.created_at > max.created_at ? obj : max,
                responseArray[0]
            );

            const userkeys = mostRecent.tags.filter((k) => k[0] === 'p');

            return userkeys.map((k) => new NDKUser({ hexpubkey: k[1] }).npub);
        } catch (error) {
            console.log('An error fetching approved members: ' + error);
            return [];
        }
    }

    public async fetchBlockedUsers(): Promise<string[]> {
        try {
            const response = await this.ndk.fetchEvents({
                kinds: [30000],
                "#d": [this.meta.uid + ':blocked'],
                authors: [this.meta.authorhex],
            });

            // Convert the Set to an array
            const responseArray = [...response];

            const userkeys = responseArray.reduce<string[]>((blockedUsers, obj) => {
                const tags = obj.tags.filter((tag) => tag[0] === 'p');
                return [...blockedUsers, ...tags.map((tag) => tag[1])];
            }, []);

            return userkeys.map((k) => new NDKUser({ hexpubkey: k }).npub);
        } catch (error) {
            console.log('An error fetching blocked users: ' + error);
            return [];
        }
    }

    public removeMember(npub:string){
        if(this.users.members?.includes(npub)){
            this.users.members = this.users.members?.filter(u => u !== npub)
            this.updateApprovedMemberList()
        }
    }

    public approveMember(npub:string){
        if(!this.users.members?.includes(npub)){
            this.users.members?.push(npub)
            this.updateApprovedMemberList()
        }
        this.users.followers = this.users.followers?.filter(u => u !== npub)
        this.users.blocked = this.users.blocked?.filter(u => u !== npub)
    }

    public blockUser(npub:string){
        this.users.members = this.users.members?.filter(u => u !== npub)
        this.updateApprovedMemberList()
        if(!this.users.blocked?.includes(npub)){
            this.users.blocked?.push(npub)
            this.updateBlockedMemberList()
        }
        this.users.followers = this.users.followers?.filter(u => u !== npub)
        this.users.blocked = this.users.members?.filter(u => u !== npub)
    }

    public unblockUser(npub:string){
        if(this.users.blocked?.includes(npub)){
            this.users.blocked = this.users.blocked?.filter(u => u !== npub)
            this.updateBlockedMemberList()
        }
    }

    public async updateApprovedMemberList(): Promise<void>{
        try{
            const ndkEvent = new NDKEvent(this.ndk);
            ndkEvent.kind = 30000;
            ndkEvent.tags.push(["d", this.meta.uid])
            this.users.members?.forEach(function(npub){
                let u = new NDKUser({npub:npub})
                ndkEvent.tags.push(["p", u.hexpubkey()])
            })
            await ndkEvent.publish();
        }
        catch(error){
            console.log('An error occurred updating list: '+error)
        }
    }

    public async updateBlockedMemberList(): Promise<void>{
        try{
            const ndkEvent = new NDKEvent(this.ndk);
            ndkEvent.kind = 30000;
            ndkEvent.tags.push(["d", this.meta.uid+':blocked'])
            this.users.blocked?.forEach(function(npub){
                let u = new NDKUser({npub:npub})
                ndkEvent.tags.push(["p", u.hexpubkey()])
            })
            await ndkEvent.publish();
        }
        catch(error){
            console.log('An error occurred updating list: '+error)
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

    // public async subscribeByID(community_id: string, cb: (data: CommunityMeta) => void, opts?: NDKSubscriptionOptions): Promise<void>{
    //     let community: CommunityMeta = {
    //         ...CommunityMetaDefaults,
    //         eid: community_id
    //     };
    //     try {
    //         let communitySub = this.ndk.subscribe(
    //             {
    //                 kinds: [1037],
    //                 "ids": [community_id],
    //             },
    //             opts
    //         );
    //         if(opts && opts.closeOnEose === false){
    //             this.subscriptions.push(communitySub)
    //         }
    //         communitySub.on("event", (event: NDKEvent) =>  {
    //             community.created = event.created_at ? event.created_at : 0;
    //             this.subscribeMeta(community, cb)
    //         });
    //     } catch (err) {
    //         console.log("An ERROR occured when subscribing to community", err);
    //     } 
    // }

    public async subscribe(filter: NDKFilter, cb: (data: CommunityMeta) => void, opts?: NDKSubscriptionOptions): Promise<void>{
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

    public async subscribeMeta(community: CommunityMeta, cb: (data: CommunityMeta) => void): Promise<void>{
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

    public async subscribeMetaMulti(filter: NDKFilter, cb: (data: CommunityMeta) => void, opts?: NDKSubscriptionOptions): Promise<void>{
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

