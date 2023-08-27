import { writable } from "@macfja/svelte-persistent-store";
import type { NDKTag, NDKUserProfile } from "@nostr-dev-kit/ndk";
import type { UserStatus } from "./user/user";
import { derived } from "svelte/store";
export let suggestedRelays: string[] = [
    "wss://eden.nostr.land",
    "wss://nostr.fmt.wiz.biz",
    "wss://relay.damus.io",
    "wss://nostr-pub.wellorder.net",
    "wss://offchain.pub",
    "wss://nos.lol", 
    "wss://relay.snort.social",
    "wss://relay.current.fyi",
    "wss://relay.nostrati.com",
    "wss://nostr.wine", 
    "wss://relay.nostr.band",
    "wss://nostr.bitcoiner.social",
    "wss://nostr.oxtr.dev",
    "wss://brb.io",
    "wss://relay.nostr.bg",
    "wss://nostr.mompill.dev",
    "wss://nostr.milou.lol",
    "wss://nostr.orangepill.dev",
    "wss://puravida.nostr.land",
    "wss://relay.nostr.info",
    "wss://atlas.nostr.land",
    "wss://nostr.zebedee.cloud",
    "wss://nostr.inosta.cc",
    "wss://no.str.cr",
    "wss://relay.nostr.com.au",
    "wss://nostr-relay.wlvs.space",
    "wss://nostr.mutinywallet.com",
    "wss://nostr-pub.semisol.dev",
    "wss://nostr.onsats.org",
    "wss://relay.plebstr.com",
    "wss://nostr.walletofsatoshi.com",
    "wss://welcome.nostr.wine",
    "wss://nostr.rocks",
    "wss://relayable.org"
]
export let userNpub = writable<string | undefined>("userNpub", undefined);
export let userHex = writable<string | undefined>("userHex", undefined);

export let userProfile = writable<string | undefined>("userProfile", undefined);
export let userStatus = writable<string>("userStatus", '[]'); // communities the logged in user follows
//export let userFollows = writable<string>("userFollows", '[]'); // communities the logged in user follows
export let userCreated = writable<string>("userCreated", '[]'); // communities the logged in user created
export let hasSigner = writable<boolean>("hasSigner", false);

export const searchCountry = writable<string>("searchCountry", "");
export const searchCity = writable<string>("searchCity", "");

export const selectedRelays = writable<string>("relays", JSON.stringify(suggestedRelays.slice(0, 10)));


export let profile: NDKUserProfile | undefined;
userProfile.subscribe((value) => {
    profile = value !== undefined ? JSON.parse(value) : undefined;
});

export const derivedProfile = derived(userProfile, (v) => {
    return v !== undefined ? JSON.parse(v) : undefined;
})

export let follows: string[];
userStatus.subscribe((value) => {
    follows = value !== undefined ? JSON.parse(value).communities : [];
});

export let uStatus: UserStatus;
userStatus.subscribe((value) => {
    uStatus = value !== undefined ? JSON.parse(value) : [];
});

export let myCommunities: Array<NDKTag>;
userCreated.subscribe((value) => {
    myCommunities = value !== undefined ? JSON.parse(value) : [];
});

export let relays: Array<string>;
selectedRelays.subscribe((value) => {
    relays = value !== undefined ? JSON.parse(value) : [];
});

export let userHasSigner: boolean;
hasSigner.subscribe((value) => {
    userHasSigner = value;
});
export let uNpub: string | undefined;
userNpub.subscribe((value) => {
    uNpub = value;
});
export let uHex: string | undefined;;
userHex.subscribe((value) => {
    uHex = value;
});
