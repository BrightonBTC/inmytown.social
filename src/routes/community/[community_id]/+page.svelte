<script lang="ts">
    import Header from "./header_components/Header.svelte";
    import Map from "./details_components/Map.svelte";
    import MemberList from "./details_components/MemberList.svelte";
    import { onDestroy, onMount } from "svelte";
    import {
        addMember,
        communityMembers,
        community,
        host
    } from "./stores/store.community";
    import Loading from "$lib/Loading.svelte";
    import Tabs from "./Tabs.svelte";
    import AdminPanel from "./AdminPanel.svelte";
    import Tags from "$lib/topics/Tags.svelte";
    import { Community, CommunitySubscriptions } from "$lib/community/community";
    import { EventSubscriptions } from "$lib/event/event";
    import { fetchUser } from "$lib/user/user";
    import ndk from "$lib/ndk";
    import { addEventMeta, communityEvents } from "./stores/store.events";
    import { loggedInUser } from "$lib/stores/user";
    import MetaTags from "$lib/MetaTags.svelte";

    export let data;

    $: community_id = data.eid;

    let communitySubs = new CommunitySubscriptions($ndk);
    let eventSubs = new EventSubscriptions($ndk);

    community.set(new Community($ndk))
    $community.meta = data

    host.set(undefined);
    communityMembers.set(undefined);
    communityEvents.set([]);

    let domready = false;

    onMount(async () => {
        domready = true;
        fetchEvents(data.authorhex)
        if(!$host){
            let h = await fetchUser($ndk, data.author);
            host.set(h)
        }
        $community.fetchMembers((user) => {
            addMember(user.npub)
        })

    });

    function fetchEvents(author: string) {
        eventSubs.subscribe({"#e": [community_id], authors:[author]}, async (data) => {
            addEventMeta(data)
        });
    }

    onDestroy(() => {
        communitySubs.closeSubscriptions()
        eventSubs.closeSubscriptions()
        $community.destroy()
    })
</script>
<MetaTags 
    title="{data.title} | Community @ InMyTown"
    description="{data.title}, a Nostr Meetup Community in {data.city} {data.country} with a focus on {data.tags.join(', ')}"
    url="{Community.url(data)}"
    image={data.image}
/>

{#if domready}
    <Header />
    {#if $loggedInUser && $host && $loggedInUser.npub === $host.npub}
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
