<script lang="ts">
    import type { Community } from "./+page";
    export let data: Community;
    import { onMount } from "svelte";
    import Loading from "$lib/Loading.svelte";
    import CommunityCard from "$lib/community/CommunityCard.svelte";
    import { goto } from "$app/navigation";
    import { myEvents } from "./stores";
    import EventRow from "./EventRow.svelte";
    import { type CommunityMeta, CommunitySubscriptions } from "$lib/community/community";
    import { EventSubscriptions } from "$lib/event/event";
    import { login } from "$lib/user/user";
    import ndk from "$lib/stores/ndk";
    import { addEvent } from "./stores";
    import { loggedInUser } from "$lib/stores/user";
    import MainContent from "$lib/MainContent.svelte";

    let communitySubs = new CommunitySubscriptions($ndk)
    let eventSubs = new EventSubscriptions($ndk)

    let community_id = data.community_id;
    let communityDetails: CommunityMeta;
    let authorised: boolean;

    myEvents.set([]);

    $: authorised ? fetchEvents(): null

    onMount(async () => {
        await login($ndk);

        if ($loggedInUser) {
            await fetchCommunity();
        }
        else{
            authorised = false;
        }
    });

    async function fetchCommunity() {
        communitySubs.subscribeByID(community_id, async (data) => {
            communityDetails = data;
            authorised = communityDetails?.author === $loggedInUser?.npub;
        });
    }

    async function fetchEvents() {
        eventSubs.subscribe({"#e": [community_id], authors:[communityDetails?.authorhex]}, async (event) => {
            addEvent(event);
        })
    }

</script>
<MainContent>
{#if authorised === true}
    {#if communityDetails}
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
    {/if}
{:else if authorised === false}
    <div class="alert alert-warning">
        <strong>Warning!</strong> You are not authorised to modify this community!
    </div>
{:else}
    <Loading />
{/if}
</MainContent>