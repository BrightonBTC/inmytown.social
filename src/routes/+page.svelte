<script lang="ts"> 
    import ndk from '$lib/ndk';
    import type { NDKEvent, NDKSubscription } from '@nostr-dev-kit/ndk';
    import { onMount } from 'svelte';
    import { addCommunity, addEvent, sortedCommunities, sortedEvents } from './stores';
    import CommunityListing from './CommunityListing.svelte';
    import EventListing from './EventListing.svelte';

    onMount(() => {
        fetchLatestCommunities()
        fetchUpcomingEvents() 
    });
    
    async function fetchLatestCommunities() {
        
        const communitiesSub = ndk.subscribe(
            {kinds: [1037], limit:20},
            { closeOnEose: false }
        );
        communitiesSub.on("event", (event: NDKEvent) => {
            addCommunity(event)
        });
        communitiesSub.on("eose", (s: NDKSubscription) => {
            $sortedCommunities = $sortedCommunities;
        });
    }
    async function fetchUpcomingEvents() {
        
        const eventsSub = ndk.subscribe(
            {kinds: [1073], limit:20},
            { closeOnEose: false }
        );
        eventsSub.on("event", (event: NDKEvent) => {
            addEvent(event)
        });
    }
</script>
<div class="row">
    <div class="col-lg-3">
        <div class="card bg-secondary mb-4">
            <div class="card-header bg-dark"><h1>Welcome</h1><strong>to InMyTown.social</strong></div>
            <div class="card-body">
                Find communities and meetup events in your local area using the <a href="https://nostr.how/en/what-is-nostr" target="_blank">NOSTR network</a>.
            </div>
        </div>
        <a href="/discover" class="btn btn-primary mb-4 d-block">Find out what's happening in your area now!</a>
    </div>
    <div class="col-lg-5">
        <div class="card bg-black mb-4">
            <div class="card-header"><h3>Latest communities</h3></div>
            <div class="card-body">
                {#each Object.values($sortedCommunities) as community}
                    <CommunityListing community={community.id} />
                {/each}
            </div>
        </div>
    </div>
    <div class="col-lg-4">
        <div class="card bg-secondary border-0 mb-4">
            <div class="card-header"><h3>Latest event listings</h3></div>
            <div class="card-body">
                {#each Object.values($sortedEvents) as event}
                    <EventListing event={event.id} />
                {/each}
            </div>
        </div>
    </div>
</div>

