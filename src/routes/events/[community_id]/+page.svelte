<script lang="ts">
    import type { Community } from "./+page";
    export let data: Community;
    import { onMount } from "svelte";
    import { NDKEvent } from "@nostr-dev-kit/ndk";

    import { userHex, userNpub } from "$lib/stores";
    import Loading from "$lib/Loading.svelte";
    import CommunityCard from "$lib/community/CommunityCard.svelte";
    import { goto } from "$app/navigation";
    import { myEvents } from "./stores";
    import EventRow from "./EventRow.svelte";
    import { type CommunityMeta, CommunityMetaDefaults, CommunitySubscriptions } from "$lib/community/community";
    import { EventMetaDefaults, type EventMeta, publishEventMeta } from "$lib/event/event";
    import { login } from "$lib/user/user";
    import ndk from "$lib/ndk";

    let communitySubs = new CommunitySubscriptions(ndk)

    let community_id = data.community_id;
    let communityDetails: CommunityMeta | undefined | null = undefined;
    let authorised: boolean | undefined;

    myEvents.set([]);

    onMount(async () => {
        await login(ndk);

        if ($userHex) {

            communitySubs.subscribeByID(data.community_id, async (data) => {
                communityDetails = data
                if (communityDetails?.author === $userNpub) {
                    authorised = true;
                    if($userHex) fetchEvents($userHex);
                } else {
                    authorised = false;
                }
            });
        }
    });

    async function fetchEvents(hexkey: string) {
        const communitiesSub = ndk.subscribe(
            {
                kinds: [1073],
                "#e": [community_id],
            },
            { closeOnEose: false }
        );
        communitiesSub.on("event", (event: NDKEvent) => {
            if (event.created_at) {
                $myEvents[event.created_at] = event;
                $myEvents = $myEvents;
            }
        });
    }

    async function createEvent() {
        const ndkEvent = new NDKEvent(ndk);
        ndkEvent.kind = 1073;
        ndkEvent.tags = [["e", community_id]];
        await ndkEvent.publish();
        let eventMeta: EventMeta = {
            ...EventMetaDefaults,
            eid: ndkEvent.id,
            uid: Math.round(Date.now()).toString(16),
            community: {
                ...CommunityMetaDefaults,
                eid: community_id,
            },
        };
        if (communityDetails?.latitude) {
            eventMeta.latitude = communityDetails?.latitude;
        }
        if (communityDetails?.longitude) {
            eventMeta.longitude = communityDetails?.longitude;
        }
        if (communityDetails?.city) {
            eventMeta.city = communityDetails?.city;
        }
        if (communityDetails?.country) {
            eventMeta.country = communityDetails?.country;
        }
        let response: NDKEvent | string | null;
        response = await publishEventMeta(ndk, eventMeta);
        goto("/event/" + ndkEvent.id + "/edit");
    }
</script>

{#if authorised === true}
    {#if communityDetails}
        <div class="row">
            <div class="col-sm-3 border-end">
                <CommunityCard {communityDetails} />
            </div>

            <div class="col-sm-9">
                <h1>Upcoming Events</h1>
                <button
                    type="button"
                    class="btn btn-success"
                    on:click|preventDefault={() => createEvent()}
                >
                    + New Event
                </button>
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
                        {#each Object.values($myEvents) as ev}
                            <EventRow {ndk} eid={ev.id} />
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
