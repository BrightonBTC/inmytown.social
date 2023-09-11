<script lang="ts">
    import "bootstrap-icons/font/bootstrap-icons.css";
    import type { MeetupEventID } from "./+page";
    export let data: MeetupEventID;

    import { onDestroy, onMount } from "svelte";

    import {
        addAttendee,
        attendeeStore,
        meetupStore,
    } from "./stores";
    
    import ndk from "$lib/ndk";
    import { userNpub } from "$lib/stores";
    import Loading from "$lib/Loading.svelte";
    import Attendees from "./Attendees.svelte";
    import Header from "./Header.svelte";
    import Details from "./Details.svelte";
    import MainContent from "./MainContent.svelte";
    import CommunityWidget from "./CommunityWidget.svelte";
    import Rsvp from "./Rsvp.svelte";

    import { EventSubscriptions, MeetupEvent } from "$lib/event/event";
    let eventSubs = new EventSubscriptions(ndk)

    let hasRsvp: string;
    let event_id = data.event_id;
    let loaded:boolean = false;

    $: console.log('meta upd', $meetupStore.meta)

    attendeeStore.set([]);
    meetupStore.set(new MeetupEvent(ndk))

    onMount(async () => {
        eventSubs.subscribeByID(event_id, async (data) => {
            $meetupStore.meta = data;
            // await $meetupStore.fetchCommunity()
            loaded = true;
            subscribeRsvp();
        })
    });

    onDestroy(() => {
        $meetupStore.destroy()
    })

    function subscribeRsvp() {
        $meetupStore.fetchRSVPs(async (event) => {
            let rsvp: string = event.tags
                .filter((x) => x[0] === "rsvp")[0][1]
                .toString();
            addAttendee(event.author.npub, rsvp);
            if (event.author.npub == $userNpub) {
                hasRsvp = rsvp;
            }
        })
    }
</script>
{#if loaded}
    <div class="row me-1">
        <div class="col-sm-4 bg-secondary rounded p-0 border">
            <h1 class="card-title text-light rounded-top mb-3 bg-secondary p-3">
                {$meetupStore.meta.title}
            </h1>
            <div class="m-3">
                <CommunityWidget />
                <Details />
                <Attendees />
            </div>
        </div>
        <div class="col-sm-8">
            <Header />
            <Rsvp {hasRsvp} />
            <MainContent />
        </div>
    </div>
{:else}
    <Loading t="Fetching Event..." />
{/if}

