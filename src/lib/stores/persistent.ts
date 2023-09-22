import { writable } from "@macfja/svelte-persistent-store";

export let suggestedRelays: string[] = [
    "wss://relay.primal.net",
    "wss://nostr-pub.wellorder.net",
    "wss://nos.lol", 
    "wss://relay.current.fyi",
    "wss://relay.nostr.band",
    "wss://nostr.orangepill.dev",
    "wss://nostr.fmt.wiz.biz",
    "wss://relay.damus.io",
    "wss://offchain.pub",
    "wss://eden.nostr.land",
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

export const npub = writable<string>("npub", "");

export const searchCountry = writable<string>("searchCountry", "");
export const searchCity = writable<string>("searchCity", "");

export const selectedRelays = writable<string>("relays", JSON.stringify(suggestedRelays.slice(0, 9)));

export let relays: Array<string>;
selectedRelays.subscribe((value) => {
    relays = value !== undefined ? JSON.parse(value) : [];
});

