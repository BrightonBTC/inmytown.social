<script lang="ts">
	import "bootstrap-icons/font/bootstrap-icons.css";
    import type { MeetupEvent } from "./+page";
    export let data: MeetupEvent;
    import { onMount } from "svelte";
    import { userHex, userNpub } from "$lib/stores";
    import Loading from "$lib/Loading.svelte";
    import { meetupStore } from "./stores";
    import EventCard from "$lib/event/EventCard.svelte";
    import { type EventMeta, EventSubscriptions } from "$lib/event/event";
    import { login } from "$lib/user/user";
    import ndk from "$lib/ndk";
    import Form from "./Form.svelte";

    let eid = data.event_id
    let authorised: boolean;
    let eventMeta: EventMeta;

    let eventSubs = new EventSubscriptions(ndk)
    
    onMount(async () => {
        await login(ndk)
        
        if($userHex){
            fetchMeetup()
        }
        else{
            authorised = false;
        }
    });

    async function fetchMeetup() {
        eventSubs.subscribeByID(eid, async (data) => {
            eventMeta = data
            if (eventMeta.author === $userNpub) {
                authorised = true;
                $meetupStore.meta = eventMeta
                
            } else {
                authorised = false;
            }
        })
    }

</script>

{#if authorised === true}
    <div class="row">
        <div class="col-sm-4 border-end border-top bg-secondary rounded">
            <h1>Edit event</h1>
            <EventCard eventData={$meetupStore.meta} />
        </div>

        <div class="col-sm-8">
            <Form {eid} />
        </div>
    </div>
{:else if authorised === false}
    <div class="alert alert-warning">
        <strong>Warning!</strong> You are not authorised to modify this event!
    </div>
{:else}
    <Loading t="Fetching Event..." />
{/if}
    