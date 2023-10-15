<script lang="ts">
    import type { CommunityID } from "./+page";
    export let data: CommunityID;
    import { onMount } from "svelte";
    import Loading from "$lib/Loading.svelte";
    import CommunityCard from "$lib/community/CommunityCard.svelte";
    import { myEvents } from "./stores";
    import EventRow from "./EventRow.svelte";
    import { type CommunityMeta, CommunitySubscriptions, Community } from "$lib/community/community";
    import { EventSubscriptions } from "$lib/event/event";
    import { login } from "$lib/user/user";
    import ndk from "$lib/stores/ndk";
    import { addEvent } from "./stores";
    import { loggedInUser } from "$lib/stores/user";
    import MainContent from "$lib/MainContent.svelte";

    let eventSubs = new EventSubscriptions($ndk)

    let community_id = data.community_id;
    let communityDetails: CommunityMeta | null;
    let loaded:loadingState = 'loading'

    myEvents.set([]);

    onMount(async () => {
        await login($ndk);

        if ($loggedInUser) {
            await fetchCommunity();
        }
        else{
            loaded = 'denied'
        }
    });

    async function fetchCommunity() {
        const community = new Community($ndk)
        communityDetails = await community.fetchMeta(community_id)
        if(communityDetails){
            const authorised = communityDetails?.author === $loggedInUser?.npub;
            if(authorised){
                loaded = 'success'
                fetchEvents(communityDetails?.authorhex)
            } 
            else loaded = 'denied'
        } 
        else loaded = 'failed'
    }

    async function fetchEvents(author:string) {
        eventSubs.subscribe({"#e": [community_id], authors:[author]}, async (event) => {
            addEvent(event);
        })
    }

</script>
<MainContent>
{#if loaded === 'success' && communityDetails}
    <div class="row">
        <div class="col-sm-3 border-end">
            <CommunityCard {communityDetails} />
        </div>

        <div class="col-sm-9">
            <h1>Upcoming Events</h1>
            <a href="/event/{community_id}/new/edit" class="btn btn-success">
                + New Event
            </a>
            <table class="table table-hover mt-5">
                <thead>
                    <tr>
                        <th>status</th>
                        <th>begins at</th>
                        <th>title</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {#each $myEvents as event}
                        <EventRow {event} />
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
{:else if loaded === 'denied'}
    <div class="alert alert-warning">
        <strong>Warning!</strong> You are not authorised to modify this community!
    </div>
{:else if loaded === 'failed'}
    <div class="alert alert-danger">
        <strong>Warning!</strong> Something went wrong fetching this community!
    </div>
{:else if loaded === 'loading'}
    <Loading />
{/if}
</MainContent>