<script lang="ts">
    import Header from "./header_components/Header.svelte";
    import Map from "./details_components/Map.svelte";
    import MemberList from "./details_components/MemberList.svelte";
    import { onDestroy, onMount } from "svelte";
    import {
        // addMember,
        // communityMembers,
        community,
        host,

        membersFetched

    } from "./stores/store.community";
    import Loading from "$lib/Loading.svelte";
    import Tabs from "./Tabs.svelte";
    import AdminPanel from "./AdminPanel.svelte";
    import Tags from "$lib/topics/Tags.svelte";
    import { Community } from "$lib/community/community";
    import { EventSubscriptions } from "$lib/event/event";
    import { fetchUser } from "$lib/user/user";
    import ndk from "$lib/stores/ndk";
    import { addEventMeta, communityEvents } from "./stores/store.events";
    import { loggedInUser } from "$lib/stores/user";
    import MetaTags from "$lib/MetaTags.svelte";
    import { page } from "$app/stores";
    import MainContent from "$lib/MainContent.svelte";

    let loadingState:loadingState = 'loading'

    export let data

    $: community_id = $page.params.community_id;

    let eventSubs = new EventSubscriptions($ndk);

    community.set(new Community($ndk))

    host.set(undefined);
    // communityMembers.set([]);
    communityEvents.set([]);

    onMount(async () => {
        // set community if we succesfully retrieved server side
        if(data.community){
            $community.meta = data.community
            loadingState = 'success'
        }
        // fetch community again client side
        let result = await $community.fetchMeta(community_id)
        if(result) loadingState = 'success'
        
        // continue if we've successfully retrieved a community, either server or client side
        if(data.community || result){
            fetchEvents($community.meta.authorhex)
            if(!$host){
                let h = await fetchUser($ndk, $community.meta.author);
                host.set(h)
            }
            await $community.fetchMembers()
            membersFetched.set(true)
            $community = $community
        }
        else loadingState = 'failed'
    });

    function fetchEvents(author: string) {
        eventSubs.subscribe({"#e": [community_id], authors:[author]}, async (data) => {
            addEventMeta(data)
        });
    }

    onDestroy(() => {
        eventSubs.closeSubscriptions()
        $community.destroy()
    })
</script>

{#if data.community}
<MetaTags 
    title="{data.community.title} | Community @ InMyTown"
    description="{data.community.title}, a Nostr Meetup Community in {data.community.city} {data.community.country} with a focus on {data.community.tags.join(', ')}"
    url="{Community.url(data.community)}"
    image={data.community.image}
    type="community"
/>
{/if}
<MainContent>
{#if loadingState === 'success'}
    {#if $loggedInUser && $host && $loggedInUser.npub === $host.npub}
        <AdminPanel {community_id} />
    {/if}
    <Header />
    <div class="row">
        <div class="col-lg-8">
            <Tabs />
        </div>

        <div class="col-lg-4">
            <div class="bg-secondary rounded shadow-sm p-3">
                <MemberList />
                <hr />
                <Tags tags={$community.meta.tags} linked={true} />
                <hr />
                <Map />
            </div>
        </div>
    </div>
{:else if loadingState === 'loading'}
    <Loading t="Searching the Nostrverse for your community" />
{:else if loadingState === 'failed'}
    <div class="alert alert-warning">
        Failed to locate community
    </div>
{/if}
</MainContent>