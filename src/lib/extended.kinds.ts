import { Kind } from 'nostr-tools/lib/event';

declare module 'nostr-tools/lib/event' {
    export enum Kind {
        MeetupCommunity = 1037,
        MeetupFollowsList = 10037,
        MeetupCommunityMeta = 30037,
        MeetupEvent = 1073,
        MeetupEventMeta = 30073,
        MeetupEventRSVP = 30042
    }
}

//const Kind = Kind as any;
//Kind["MeetupCommunity"] = 1037;