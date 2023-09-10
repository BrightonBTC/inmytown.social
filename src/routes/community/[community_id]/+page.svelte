<script lang="ts">
    import type { Community } from "./+page";
    export let data: Community;
    import Header from "./Header.svelte";
    import Map from "./Map.svelte";
    import MemberList from "./MemberList.svelte";
    import type { NDKEvent, NDKUser } from "@nostr-dev-kit/ndk";
    import { onDestroy, onMount } from "svelte";
    import {
        addEvent,
        addEventMeta,
        addMember,
        communityEvents,
        communityEventsDraft,
        communityEventsPast,
        communityEventsUpcoming,
        communityMembers,
        community
    } from "./stores";
    import Loading from "$lib/Loading.svelte";
    import Tabs from "./Tabs.svelte";
    import { userNpub } from "$lib/stores";
    import AdminPanel from "./AdminPanel.svelte";
    import Tags from "$lib/topics/Tags.svelte";
    import { Communities } from "$lib/community/community";
    import { subEventMeta } from "$lib/event/event";
    import { fetchUser } from "$lib/user/user";
    import ndk from "$lib/ndk";

    $: community_id = data.community_id;

    let host: NDKUser | undefined;

    let communities = new Communities(ndk)

    communityMembers.set([]);
    communityEvents.set([]);
    communityEventsUpcoming.set([]);
    communityEventsPast.set([]);
    communityEventsDraft.set([]);

    onMount(async () => {
        
        communities.subscribeByID(community_id, async (data) => {
            $community.meta = data
            if(!host) host = await fetchUser(ndk, data.author);
            $community.fetchMembers((user) => {
                addMember(user.npub)
            })
        }, {closeOnEose: false});

        fetchEvents();
    });

    onDestroy(() => {
        communities.closeSubscriptions()
    })

    async function fetchEvents() {
        try {
            const eventsSub = ndk.subscribe(
                {
                    kinds: [1073],
                    "#e": [community_id],
                }
            );
            eventsSub.on("event", (event: NDKEvent) => {
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
        subEventMeta(ndk, id, async (data) => {
            addEventMeta(data);
        });
    }
</script>

{#if $community.meta}
    <Header {host} />
    {#if $userNpub && host && $userNpub === host.npub}
        <AdminPanel {community_id} />
    {/if}
    <div class="row me-1">
        <div class="col-sm-8">
            <Tabs />
        </div>

        <div class="col-sm-4 bg-secondary rounded shadow-sm">
            <Map />

            <Tags tags={$community.meta.tags} linked={true} />

            <MemberList />
        </div>
    </div>
{:else}
    <Loading />
{/if}
