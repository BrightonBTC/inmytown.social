<script lang="ts">
    import type { Community } from "./+page";
    export let data: Community;
    import Header from "./Header.svelte";
    import Map from "./Map.svelte";
    import MemberList from "./MemberList.svelte";
    import type NDK from "@nostr-dev-kit/ndk";
    import type { NDKEvent, NDKUser } from "@nostr-dev-kit/ndk";
    import { onMount } from "svelte";
    import {
        addEvent,
        addEventMeta,
        addMember,
        communityEvents,
        communityEventsDraft,
        communityEventsPast,
        communityEventsUpcoming,
        communityMembers,
    } from "./stores";
    import Loading from "$lib/Loading.svelte";
    import Tabs from "./Tabs.svelte";
    import { userNpub } from "$lib/stores";
    import AdminPanel from "./AdminPanel.svelte";
    import { loadNDK } from "$lib/nostr";
    import Tags from "$lib/topics/Tags.svelte";
    import { fetchCommunity, type CommunityMeta } from "$lib/community/community";
    import { fetchEvent } from "$lib/event/event";
    import { fetchUser } from "$lib/user/user";

    $: community_id = data.community_id;
    let ndk: NDK;
    let communityDetails: CommunityMeta | undefined | null = undefined;
    let host: NDKUser | undefined;
    communityMembers.set([]);
    communityEvents.set([]);
    communityEventsUpcoming.set([]);
    communityEventsPast.set([]);
    communityEventsDraft.set([]);

    onMount(async () => {
        ndk = await loadNDK();
        communityDetails = await fetchCommunity(ndk, community_id);
        if (communityDetails) {
            host = await fetchUser(ndk, communityDetails.author);
        }
        fetchMembers();
        fetchEvents();
    });

    async function fetchMembers() {
        try {
            const membersSub = ndk.subscribe(
                {
                    kinds: [10037],
                    "#e": [community_id],
                },
                {
                    closeOnEose: false,
                }
            );
            membersSub.on("event", (event: NDKEvent) => {
                if (!$communityMembers.includes(event.author.npub)) {
                    addMember(event.author.npub);
                }
            });
        } catch (err) {
            console.log("An ERROR occured", err);
        }
    }

    async function fetchEvents() {
        console.log("fetchEvents", community_id);
        try {
            const eventsSub = ndk.subscribe(
                {
                    kinds: [1073],
                    "#e": [community_id],
                },
                {
                    closeOnEose: false,
                }
            );
            eventsSub.on("event", (event: NDKEvent) => {
                console.log("-------- EVENT");
                if (!$communityEvents.includes(event.id)) {
                    fetchEventMeta(event.id);
                }
                addEvent(event.id);
            });
        } catch (err) {
            console.log("An ERROR occured", err);
        }
    }

    async function fetchEventMeta(id: string) {
        let event = await fetchEvent(ndk, id);
        if (event && typeof event !== "string") {
            addEventMeta(event);
        }
    }
</script>

{#if communityDetails}
    <Header {ndk} {communityDetails} {community_id} {host} />
    {#if $userNpub && host && $userNpub === host.npub}
        <AdminPanel {community_id} />
    {/if}
    <div class="row me-1">
        <div class="col-sm-8">
            <Tabs {ndk} {communityDetails} />
        </div>

        <div class="col-sm-4 bg-secondary rounded">
            <Map {communityDetails} />

            <Tags tags={communityDetails.tags} linked={true} />

            <MemberList {ndk} />
        </div>
    </div>
{:else}
    <Loading />
{/if}
