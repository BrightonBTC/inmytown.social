<script lang="ts">
    import "bootstrap-icons/font/bootstrap-icons.css";
    import type { MeetupEvent } from "./+page";
    export let data: MeetupEvent;
    import { onMount } from "svelte";
    import type NDK from "@nostr-dev-kit/ndk";
    import type { NDKEvent } from "@nostr-dev-kit/ndk";
    import {
        loadNDK
    } from "$lib/nostr";
    import { userNpub } from "$lib/stores";
    import CommunityCard from "$lib/community/CommunityCard.svelte";
    import { marked } from "marked";
    import { dateStringFull } from "$lib/formatDates";
    import Map from "./Map.svelte";
    import Rsvp from "./Rsvp.svelte";
    import {
        addAttendee,
        attendeeStore,
        attendees,
        interested,
    } from "./stores";
    import LinkedPfpIcon from "$lib/user/LinkedPFPIcon.svelte";
    import { imgUrlOrDefault } from "$lib/helpers";
    import { fetchCommunity, type CommunityMeta } from "$lib/community/community";
    import { fetchEvent, type EventMeta } from "$lib/event/event";

    let ndk: NDK;
    let communityDetails: CommunityMeta | undefined | null = undefined;
    let eventMeta: EventMeta | null | string = null;
    let hasRsvp: string;
    let event_id = data.event_id;

    console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);

    attendeeStore.set([]);

    onMount(async () => {
        ndk = await loadNDK();
        fetchEventDetails();
        subscribeRsvp();
    });

    async function fetchEventDetails() {
        eventMeta = await fetchEvent(ndk, event_id);
        if (eventMeta && typeof eventMeta !== "string") {
            fetchCommunityDetails(eventMeta.community.eid);
        }
    }

    async function fetchCommunityDetails(id: string) {
        console.log("eid", id);
        communityDetails = await fetchCommunity(ndk, id);
    }

    function subscribeRsvp() {
        try {
            const eventsSub = ndk.subscribe(
                {
                    kinds: [30038],
                    "#d": [event_id],
                },
                {
                    closeOnEose: false,
                }
            );
            eventsSub.on("event", (event: NDKEvent) => {
                let rsvp: string = event.tags
                    .filter((x) => x[0] === "rsvp")[0][1]
                    .toString();
                addAttendee(event.author.npub, rsvp);
                if (event.author.npub == $userNpub) {
                    hasRsvp = rsvp;
                }
            });
        } catch (err) {
            console.log("An ERROR occured", err);
        }
    }
</script>

{#if eventMeta && typeof eventMeta !== "string"}
    <div class="row me-1">
        <div class="col-sm-4 bg-secondary rounded p-0 border">
            <h1 class="card-title text-light rounded-top mb-3 bg-secondary p-3">
                {eventMeta.title}
            </h1>
            <div class="m-3">
                <p class="ms-3 mb-2 text-muted">An event from:</p>
                {#if communityDetails}
                    <CommunityCard
                        {communityDetails}
                    />
                {/if}
                <ul class="list-group list-group-flush mt-3">
                    <li class="list-group-item d-flex">
                        <i class="bi bi-clock pe-2 text-primary" />
                        <small class="ps-2 text-muted">
                            <strong>Starts:</strong>
                            {dateStringFull(eventMeta.starts)}<br />
                            <strong>Ends:</strong>
                            {dateStringFull(eventMeta.ends)}
                        </small>
                    </li>
                    <li class="list-group-item d-flex">
                        <i class="bi bi-geo-alt me-2 text-primary" />
                        <div class="ps-2">
                            {eventMeta.venue}<br /><small
                                >{eventMeta.city}, {eventMeta.country}</small
                            >
                        </div>
                    </li>
                    <li class="list-group-item">
                        <Map {eventMeta} />
                    </li>
                    <li class="list-group-item">
                        <i class="bi bi-tag me-2 text-primary" />
                        {#each eventMeta.tags as t}
                            <span class="badge rounded-pill bg-info me-1"
                                >#{t}</span
                            >
                        {/each}
                    </li>
                </ul>
                <ul class="list-group list-group-flush mt-3">
                    {#if Object.values($attendees).length > 0}
                        <li class="list-group-item">
                            <div class="text-muted">
                                Going ({Object.values($attendees).length})
                            </div>
                            {#each Object.values($attendees) as a}
                                <div class="p-1 float-start">
                                    <LinkedPfpIcon {ndk} npub={a[0]} />
                                </div>
                            {/each}
                        </li>
                    {/if}

                    {#if Object.values($interested).length > 0}
                        <li class="list-group-item">
                            <div class="text-muted">
                                Interested ({Object.values($interested).length})
                            </div>
                            {#each Object.values($interested) as a}
                                <div class="p-1 float-start">
                                    <LinkedPfpIcon {ndk} npub={a[0]} />
                                </div>
                            {/each}
                        </li>
                    {/if}
                </ul>
            </div>
        </div>
        <div class="col-sm-8">
            <img
                src={imgUrlOrDefault(eventMeta.image)}
                alt={eventMeta.title}
                class="img-fluid rounded e-im"
            />
            <div class="mt-2 text-center bg-secondary rounded border p-2">
                <Rsvp {ndk} {event_id} {hasRsvp} />
            </div>

            <p class="lead mt-2">
                <span class="badge bg-dark mb-1 text-light border"
                    ><i class="bi bi-clock pe-2 text-primary" />
                    {dateStringFull(eventMeta.starts)}</span
                >
            </p>

            <div class="p-5 border-end">
                {@html marked(eventMeta.content)}
            </div>
        </div>
    </div>
{/if}

<style>
    .e-im {
        object-fit: cover;
        width: 100%;
        max-height: 300px;
    }
</style>
