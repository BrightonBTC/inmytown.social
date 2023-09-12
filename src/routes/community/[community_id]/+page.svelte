<script lang="ts">
    import type { CommunityID } from "./+page";
    export let data: CommunityID;
    import Header from "./Header.svelte";
    import Map from "./Map.svelte";
    import MemberList from "./MemberList.svelte";
    import type { NDKUser } from "@nostr-dev-kit/ndk";
    import { onDestroy, onMount } from "svelte";
    import {
        addMember,
        communityMembers,
        community,
    } from "./store.community";
    import Loading from "$lib/Loading.svelte";
    import Tabs from "./Tabs.svelte";
    import { userNpub } from "$lib/stores";
    import AdminPanel from "./AdminPanel.svelte";
    import Tags from "$lib/topics/Tags.svelte";
    import { Community, CommunitySubscriptions } from "$lib/community/community";
    import { EventSubscriptions } from "$lib/event/event";
    import { fetchUser } from "$lib/user/user";
    import ndk from "$lib/ndk";
    import { addEventMeta, communityEvents } from "./store.events";

    $: community_id = data.community_id;

    let host: NDKUser | undefined;

    let communitySubs = new CommunitySubscriptions(ndk);
    let eventSubs = new EventSubscriptions(ndk);

    community.set(new Community(ndk))
    communityMembers.set([]);
    communityEvents.set([]);

    onMount(async () => {
        
        communitySubs.subscribeByID(community_id, async (data) => {
            $community.meta = data
            if(!host) host = await fetchUser(ndk, data.author);
            $community.fetchMembers((user) => {
                addMember(user.npub)
            })
        });

        eventSubs.subscribe({"#e": [community_id]}, async (data) => {
            addEventMeta(data)
        });

    });

    onDestroy(() => {
        communitySubs.closeSubscriptions()
        eventSubs.closeSubscriptions()
        $community.destroy()
    })
</script>

{#if $community.meta.eid.length > 0}
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
