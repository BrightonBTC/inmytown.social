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
    import { Community, CommunitySubscriptions } from "$lib/community/community";
    import { loggedInUser } from "$lib/stores/user";
    import DuplicateEvent from "./DuplicateEvent.svelte";
    import MainContent from "$lib/MainContent.svelte";

    let eid = data.event_id
    let authorised: boolean;
    let eventMeta: EventMeta;

    let loadingMessage:string = 'Fetching community...';

    let eventSubs = new EventSubscriptions($ndk);
    let communitySubs = new CommunitySubscriptions($ndk);

    $: eid, community.set(new Community($ndk)), meetupStore.set(new MeetupEvent($ndk))
    
    onMount(async () => {
        await login($ndk)
        
        if($loggedInUser){
            fetchCommunity()
        }
        else{
            authorised = false;
        }
    });

    async function fetchCommunity(){
        communitySubs.subscribeByID(data.community_id, async (data) => {
            $community.meta = data;
            if(eid==='new' && $loggedInUser){
                meetupStore.set(MeetupEvent.new($ndk, $community.meta))
                authorised = true;
            }
            else fetchMeetup();
        });
    }

    async function fetchMeetup() {
        loadingMessage = 'Fetching event...'
        eventSubs.subscribeOne($community.meta, eid, async (data) => {
            eventMeta = data
            if (eventMeta.author === $loggedInUser?.npub) {
                authorised = true;
                $meetupStore.meta = eventMeta
                
            } else {
                authorised = false;
            }
        })
    }

</script>
<MainContent>
{#if authorised === true}
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
{:else if authorised === false}
    <div class="alert alert-warning">
        <strong>Warning!</strong> You are not authorised to modify this event!
    </div>
{:else}
    <Loading t={loadingMessage} />
{/if}
</MainContent>