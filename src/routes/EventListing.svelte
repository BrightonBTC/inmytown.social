<script lang="ts"> 
    import Loading from '$lib/Loading.svelte';
    import EventCard from '$lib/event/EventCard.svelte';
    import { subEventMeta, type EventMeta } from '$lib/event/event';
    import ndk from '$lib/ndk';
    import { onMount } from 'svelte';

    export let event:string

    let eventData: EventMeta

    onMount(async () => {

        subEventMeta(ndk, event, async (data) => {
            eventData = data;
        });
    })
</script>
<div class="mb-0">
    
    {#if eventData}
    <EventCard {eventData} />
    {:else}
    <Loading />
    {/if}
</div>