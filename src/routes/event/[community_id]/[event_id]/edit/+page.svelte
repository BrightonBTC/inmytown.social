<script lang="ts">
	import "bootstrap-icons/font/bootstrap-icons.css";
    import type { URLVars } from "./+page";
    export let data: URLVars;
    import { onMount } from "svelte";
    import Loading from "$lib/Loading.svelte";
    import { community, meetupStore } from "./stores";
    import EventCard from "$lib/event/EventCard.svelte";
    import { type EventMeta, EventSubscriptions, MeetupEvent } from "$lib/event/event";
    import { login } from "$lib/user/user";
    import ndk from "$lib/stores/ndk";
    import Form from "./Form.svelte";
    import { Community } from "$lib/community/community";
    import { loggedInUser } from "$lib/stores/user";
    import DuplicateEvent from "./DuplicateEvent.svelte";
    import MainContent from "$lib/MainContent.svelte";

    let eid = data.event_id
    let loaded:loadingState = 'loading'
    let eventMeta: EventMeta;

    let loadingMessage:string = 'Fetching community...';

    let eventSubs = new EventSubscriptions($ndk);

    $: eid, community.set(new Community($ndk)), meetupStore.set(new MeetupEvent($ndk))
    
    onMount(async () => {
        await login($ndk)
        
        if($loggedInUser){
            fetchCommunity()
        }
        else{
            loaded = 'denied'
        }
    });

    async function fetchCommunity(){

        const success = await $community.fetchMeta(data.community_id)
        if(success){
            $community = $community
            if(eid==='new' && $loggedInUser){
                meetupStore.set(MeetupEvent.new($ndk, $community.meta))
                loaded = 'success'
            }
            else fetchMeetup();
        }
        else loaded = 'failed'

    }

    async function fetchMeetup() {
        loadingMessage = 'Fetching event...'
        eventSubs.subscribeOne($community.meta, eid, async (data) => {
            eventMeta = data
            if (eventMeta.author === $loggedInUser?.npub) {
                loaded = 'success'
                $meetupStore.meta = eventMeta
                
            } else {
                loaded = 'denied'
            }
        })
    }

</script>
<MainContent>
{#if loaded === 'success'}
    <div class="row">
        <div class="col-sm-4 border-end border-top bg-secondary rounded">
            <h1>Edit event</h1>
            <EventCard eventData={$meetupStore.meta} />
        </div>

        <div class="col-sm-8">

            {#if eid === "new"}
                <DuplicateEvent />
            {/if}
            
            <Form />
        </div>
    </div>
{:else if loaded === 'denied'}
    <div class="alert alert-warning">
        <strong>Warning!</strong> You are not authorised to modify this event!
    </div>
{:else if loaded === 'failed'}
    <div class="alert alert-danger">
        <strong>Something went wrong!</strong> Unable to fetch community!
    </div>
{:else}
    <Loading t={loadingMessage} />
{/if}
</MainContent>