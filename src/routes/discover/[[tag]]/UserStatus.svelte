<script lang="ts">
    import { parseUserStatusData } from "$lib/user/user";
    import type { NDKEvent } from "@nostr-dev-kit/ndk";
    import Location from "$lib/location/Location.svelte";
    import Tags from "$lib/topics/Tags.svelte";

    export let statusData: NDKEvent;

    let d = parseUserStatusData(statusData)
    
</script>
<p>{d.status}</p>
<Location city={d.city} country={d.country} />
{#if d.locationStatus == 'visiting'}
<span class="badge bg-secondary">visiting</span>
{/if}
<div class="mt-3">
    <Tags tags={d.interests} linked={true} />
</div>
