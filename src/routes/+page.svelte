<script lang="ts"> 
    import ndk from '$lib/ndk';
    import { onDestroy, onMount } from 'svelte';
    import { addCommunity, addEvent, sortedCommunities, sortedEvents } from './stores';
    import { CommunitySubscriptions } from '$lib/community/community';
    import CommunityCardLarge from '$lib/community/CommunityCardLarge.svelte';
    import { EventSubscriptions } from '$lib/event/event';
    import EventCardSmall from '$lib/event/EventCardSmall.svelte';

    let communitySubs = new CommunitySubscriptions(ndk);
    let eventSubs = new EventSubscriptions(ndk);

    onMount(() => {
        communitySubs.subscribe({limit:50}, async (data) => {
            addCommunity(data)
        }, {closeOnEose: false});

        eventSubs.subscribe({limit:50, '#l':['meetup']}, async (data) => {
            addEvent(data)
        }, {closeOnEose: false});

    });

    onDestroy(() => {

        communitySubs.closeSubscriptions();
        eventSubs.closeSubscriptions();

    })

</script>
<div class="row">
    <div class="col-lg-3">
        <div class="card bg-secondary mb-4 shadow-sm">
            <div class="card-header bg-dark"><h1>Welcome</h1><strong>to InMyTown.social</strong></div>
            <div class="card-body">
                Find communities and meetup events in your local area using the <a href="https://nostr.how/en/what-is-nostr" target="_blank">NOSTR network</a>.
            </div>
        </div>
        <a href="/discover" class="btn btn-primary mb-4 d-block">Find out what's happening in your area now!</a>
    </div>
    <div class="col-lg-5">
        <div class="card bg-black mb-4">
            <div class="card-header"><h5>Latest communities</h5></div>
            <div class="card-body">
                {#each Object.values($sortedCommunities) as communityDetails}
                    <CommunityCardLarge {communityDetails} />
                {/each}
            </div>
        </div>
    </div>
    <div class="col-lg-4">
        <div class="card bg-secondary border-0 mb-4">
            <div class="card-header"><h5>Upcoming Events (Global)</h5></div>
            <div class="card-body">
                {#each Object.values($sortedEvents) as eventData}
                    <EventCardSmall eid={eventData.eid} {eventData} />
                {/each}
            </div>
        </div>
    </div>
</div>

