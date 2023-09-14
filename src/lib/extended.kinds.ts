import { Kind } from 'nostr-tools/lib/event';

declare module 'nostr-tools/lib/event' {
    export enum Kind {
        MeetupCommunityCreation = 1037,
        MeetupFollowsList = 10037,
        MeetupCommunityMetadata = 30037,
        MeetupEventCreation = 1073,
        CalendarEvent = 31923,
        CalendarRSVP = 31925
    }
}

//const Kind = Kind as any;
//Kind["MeetupCommunity"] = 1037;