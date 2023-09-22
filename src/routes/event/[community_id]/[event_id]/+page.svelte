<script lang="ts">
    import "bootstrap-icons/font/bootstrap-icons.css";
    import type { URLVars } from "./+page";
    export let data: URLVars;

    import { onDestroy, onMount } from "svelte";

    import {
        addAttendee,
        attendeeStore,
        community,
        meetupStore,
    } from "./stores";
    
    import ndk from "$lib/ndk";
    import { userNpub } from "$lib/stores/persistent";
    import Loading from "$lib/Loading.svelte";
    import Attendees from "./Attendees.svelte";
    import Header from "./Header.svelte";
    import Details from "./Details.svelte";
    import MainContent from "./MainContent.svelte";
    import CommunityWidget from "./CommunityWidget.svelte";
    import Rsvp from "./Rsvp.svelte";

    import { EventSubscriptions, MeetupEvent } from "$lib/event/event";
    import AdminPanel from "./AdminPanel.svelte";
    import { Community, CommunitySubscriptions } from "$lib/community/community";
    let eventSubs = new EventSubscriptions($ndk);
    let communitySubs = new CommunitySubscriptions($ndk);

    let hasRsvp: string;
    let event_id = data.event_id;
    let loaded:boolean = false;

    let loadingMessage:string = 'Fetching community...';

    attendeeStore.set([]);
    community.set(new Community($ndk))
    meetupStore.set(new MeetupEvent($ndk))

    onMount(async () => {
        communitySubs.subscribeByID(data.community_id, async (data) => {
            $community.meta = data;
            fetchEvent();
        });
    });

    onDestroy(() => {
        $meetupStore.destroy()
    })

    async function fetchEvent(){
        loadingMessage = 'Fetching event...'
        eventSubs.subscribeOne($community.meta, event_id, async (data) => {
            $meetupStore.meta = data;
            // await $meetupStore.fetchCommunity()
            loaded = true;
            subscribeRsvp();
        })
    }

    function subscribeRsvp() {
        $meetupStore.fetchRSVPs(async (event) => {
            let rsvp: string = event.tags
                .filter((x) => x[0] === "l" && x[2] === 'status')[0][1]
                .toString();
            addAttendee(event.author.npub, rsvp);
            if (event.author.npub == $userNpub) {
                hasRsvp = rsvp;
            }
        })
    }
</script>
{#if loaded}
    <div class="row">
        <div class="col-md-4">
            <div class=" bg-secondary rounded p-0 border">
                <h1 class="card-title text-light rounded-top mb-3 bg-secondary p-3">
                    {$meetupStore.meta.title}
                </h1>
                <div class="m-3">
                    <CommunityWidget />
                    <Details />
                    <Attendees />
                </div>
            </div>
        </div>
        <div class="col-md-8">
            {#if $userNpub && $userNpub === $meetupStore.meta.author}
                <AdminPanel data={$meetupStore.meta} />
            {/if}
            <Header />
            <Rsvp {hasRsvp} />
            <MainContent />
        </div>
    </div>
{:else}
    <Loading t={loadingMessage} />
{/if}

