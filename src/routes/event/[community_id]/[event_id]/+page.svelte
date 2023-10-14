<script lang="ts">
    import "bootstrap-icons/font/bootstrap-icons.css";

    import { onDestroy, onMount } from "svelte";

    import {
        addAttendee,
        attendeeStore,
        community,
        meetupStore,
    } from "./stores";
    
    import ndk from "$lib/stores/ndk";
    import Loading from "$lib/Loading.svelte";
    import Attendees from "./Attendees.svelte";
    import Header from "./Header.svelte";
    import Details from "./Details.svelte";
    import CommunityWidget from "./CommunityWidget.svelte";
    import Rsvp from "./Rsvp.svelte";

    import {  MeetupEvent } from "$lib/event/event";
    import AdminPanel from "./AdminPanel.svelte";
    import { loggedInUser } from "$lib/stores/user";
    import MetaTags from "$lib/MetaTags.svelte";
    import { Community } from "$lib/community/community";
    import { page } from "$app/stores";
    import EventEndedAlert from "$lib/event/EventEndedAlert.svelte";
    import Content from "./Content.svelte";
    import MainContent from "$lib/MainContent.svelte";

    export let data;

    let loadingState:loadingState = 'loading'
    let fetchedMembers = false

    let hasRsvp: string;

    let loadingMessage:string = 'Fetching community...';

    attendeeStore.set([]);
    meetupStore.set(new MeetupEvent($ndk))
    community.set(new Community($ndk))

    onMount(async () => {
        if(data.event){
            $meetupStore.meta = data.event;
            loadingState = 'success'
        }
        let success = await $community.fetchMeta($page.params.community_id)

        if(success){
            $community.meta = success
            await $community.fetchMembers()
            $community = $community
            fetchedMembers = true
            console.log('1',$community.meta)
            let success2 = await $meetupStore.fetch(
                $page.params.event_id, 
                $community.meta.eid, 
                $community.meta.authorhex
            )
            if(success2) loadingState = 'success'
        } 
        if(!data && !success) loadingState = 'failed'
        subscribeRsvp();
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
{#if data.event}
<MetaTags 
    title="{data.event.title} | Events InMyTown"
    description={data.event.brief}
    url="{MeetupEvent.url(data.event)}"
    image={data.event.image}
    type="event"
/>
{/if}
<MainContent>
{#if loadingState === 'success'}

    {#if $loggedInUser && $loggedInUser.npub === $meetupStore.meta.author}
    <AdminPanel data={$meetupStore.meta} />
    {/if}
    <EventEndedAlert starts={$meetupStore.meta.starts} ends={$meetupStore.meta.ends} />
    <div class="row">
        <div class="col-md-4">
            <div class=" bg-secondary rounded p-0 border">
                <h1 class="card-title text-light rounded-top mb-3 bg-secondary p-3">
                    {$meetupStore.meta.title}
                </h1>
                <div class="m-3">
                    <CommunityWidget />
                    <Details />
                    {#if fetchedMembers}
                    <Attendees />
                    {/if}
                </div>
            </div>
        </div>
        <div class="col-md-8">
            <Header />
            <Rsvp {hasRsvp} />
            <Content />
        </div>
    </div>
{:else if loadingState === 'loading'}
    <Loading t={loadingMessage} />
{:else if loadingState === 'failed'}
    <div class="alert alert-warning">
        Failed to locate meetup event
    </div>
{/if}
</MainContent>
