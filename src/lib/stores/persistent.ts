import { writable } from "@macfja/svelte-persistent-store";
import { derived } from "svelte/store";

export let suggestedRelays: string[] = [
    "wss://relay.primal.net",
    "wss://nostr-pub.wellorder.net",
    "wss://nos.lol", 
    "wss://relay.nostr.band",
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

export const selectedRelays = writable<string>("relays", JSON.stringify(suggestedRelays.slice(0, 7)));

export let relays: Array<string>;
selectedRelays.subscribe((value) => {
    relays = value !== undefined ? JSON.parse(value) : [];
});

export const noticeDismissed = writable<string>("noticeDismissed", "");

enum notificationKind{
    message = 0,
    joinRequest = 1
}

type notification = {
    ts: number,
    kind: notificationKind,
    event: string,
    seen: boolean
}

export const notificationStore = writable<string>("notifications", JSON.stringify([]));

export const notifications = derived(notificationStore, (value) => value !== undefined ? JSON.parse(value) : [])

function notificationAdd(notification:notification){
    let n: notification[] = []
    notificationStore.subscribe((value) => {
        n = value !== undefined ? JSON.parse(value) : [];
    });
    n.append()
    notificationStore.set(JSON.stringify([]))
}
