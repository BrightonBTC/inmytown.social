<script lang="ts">
    import type { Community } from "./+page";
    export let data: Community;
    import { onMount } from "svelte";

    import { userNpub } from "$lib/stores";
    import Loading from "$lib/Loading.svelte";
    import CommunityCard from "$lib/community/CommunityCard.svelte";
    import { goto } from "$app/navigation";
    import { myEvents } from "./stores";
    import EventRow from "./EventRow.svelte";
    import { type CommunityMeta, CommunitySubscriptions } from "$lib/community/community";
    import { EventSubscriptions, MeetupEvent } from "$lib/event/event";
    import { login } from "$lib/user/user";
    import ndk from "$lib/ndk";
    import { addEvent } from "./stores";

    let communitySubs = new CommunitySubscriptions(ndk)
    let eventSubs = new EventSubscriptions(ndk)

    let community_id = data.community_id;
    let communityDetails: CommunityMeta;
    let authorised: boolean;

    myEvents.set([]);

    $: authorised ? fetchEvents(): void

    onMount(async () => {
        await login(ndk);

        if ($userNpub) {
            await fetchCommunity();
        }
        else{
            authorised = false;
        }
    });

    async function fetchCommunity() {
        communitySubs.subscribeByID(community_id, async (data) => {
            communityDetails = data;
            authorised = communityDetails?.author === $userNpub;
        });
    }

    async function fetchEvents() {
        eventSubs.subscribe({"#e": [community_id]}, async (event) => {
            console.log(event)
            addEvent(event);
        })
    }

    // async function createEvent() {
    //     let newMeetupEvent = await MeetupEvent.create(ndk, communityDetails);
    //     console.log('newMeetupEvent', newMeetupEvent)
    //     await newMeetupEvent.publish();
    //     goto("/event/" + newMeetupEvent.meta.eid + "/edit");
    // }
</script>

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
                <!-- <button
                    type="button"
                    class="btn btn-success"
                    on:click|preventDefault={() => createEvent()}
                >
                    + New Event
                </button> -->
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
                            <EventRow {community_id} {event} />
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
