<script lang="ts">
    import "bootstrap-icons/font/bootstrap-icons.css";

    import { onDestroy, onMount } from "svelte";

    import {
        addAttendee,
        attendeeStore,
        meetupStore,
    } from "./stores";
    
    import ndk from "$lib/ndk";
    import Loading from "$lib/Loading.svelte";
    import Attendees from "./Attendees.svelte";
    import Header from "./Header.svelte";
    import Details from "./Details.svelte";
    import MainContent from "./MainContent.svelte";
    import CommunityWidget from "./CommunityWidget.svelte";
    import Rsvp from "./Rsvp.svelte";

    import {  MeetupEvent } from "$lib/event/event";
    import AdminPanel from "./AdminPanel.svelte";
    import { loggedInUser } from "$lib/stores/user";

    export let data;

    let hasRsvp: string;
    let loaded:boolean = false;

    let loadingMessage:string = 'Fetching community...';

    attendeeStore.set([]);
    meetupStore.set(new MeetupEvent($ndk))

    onMount(async () => {
        $meetupStore.meta = data;
        subscribeRsvp();
        loaded = true
    });

    onDestroy(() => {
        $meetupStore.destroy()
    })

    function subscribeRsvp() {
        $meetupStore.fetchRSVPs(async (event) => {
            let rsvp: string = event.tags
                .filter((x) => x[0] === "l" && x[2] === 'status')[0][1]
                .toString();
            addAttendee(event.author.npub, rsvp);
            if (event.author.npub == $loggedInUser?.npub) {
                hasRsvp = rsvp;
            }
        })
    }
</script>

<svelte:head>
    <title>{data.title} | Events InMyTown</title>
    <meta
        name="description"
        content={data.brief}
    />

    <meta property="og:title" content={data.title} />
    <meta property="og:type" content="website" />
    <meta
        property="og:url"
        content="https://inmytown.social/community/{data.eid}"
    />
    <meta property="og:image" content={data.image} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta property="twitter:domain" content="inmytown.social" />
    <meta name="twitter:title" content={data.title} />
    <meta
        name="twitter:description"
        content={data.brief}
    />
    <meta
        property="twitter:url"
        content="https://inmytown.social/community/{data.eid}"
    />
    <meta name="twitter:image" content={data.image} />
</svelte:head>

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
            {#if $loggedInUser && $loggedInUser.npub === $meetupStore.meta.author}
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

