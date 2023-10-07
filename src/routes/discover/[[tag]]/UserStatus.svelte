<script lang="ts">
    import { MeetupUser } from "$lib/user/user";
    import type { NDKEvent } from "@nostr-dev-kit/ndk";
    import Location from "$lib/location/Location.svelte";
    import Tags from "$lib/topics/Tags.svelte";
    import LocationStatus from "$lib/user/LocationStatus.svelte";

    export let statusData: NDKEvent;

    let d = MeetupUser.parseStatus(statusData)
    
</script>
<p class="bg-dark rounded p-2 shadow-sm border border-secondary">
    <LocationStatus status={d.status ? d.status:''} />    
</p>
<Location city={d.city} country={d.country} />
{#if d.locationStatus == 'visiting'}
<span class="badge bg-secondary">visiting</span>
{/if}
<div class="mt-3">
    <Tags tags={d.interests} linked={true} />
</div>
<style>
    i{
        font-size: .8rem;
    }
    i::before{
        transform: translateY(-.3rem);
    }
    i.rot180::before{
        transform: rotate(180deg) translateY(.3rem);
    }
</style>