<script lang="ts">
    import EventCardLarge from "$lib/event/EventCardLarge.svelte";
    import type NDK from "@nostr-dev-kit/ndk";
    
    import { sortedPast, sortedUpcoming } from "./stores";

    export let ndk: NDK;
</script>

<ul class="nav nav-tabs mt-2" id="myTab" role="tablist">
    <li class="nav-item" role="presentation">
        <button
            class="nav-link active"
            id="upcoming-tab"
            data-bs-toggle="tab"
            data-bs-target="#upcoming"
            type="button"
            role="tab"
            aria-controls="upcoming"
            aria-selected="true">Upcoming Events</button
        >
    </li>
    <li class="nav-item" role="presentation">
        <button
            class="nav-link"
            id="past-tab"
            data-bs-toggle="tab"
            data-bs-target="#past"
            type="button"
            role="tab"
            aria-controls="past"
            aria-selected="false">Past Events</button
        >
    </li>
</ul>
<div class="tab-content" id="myTabContent">
    <div
        class="tab-pane fade show active"
        id="upcoming"
        role="tabpanel"
        aria-labelledby="upcoming-tab"
    >
        {#each Object.values($sortedUpcoming) as eventData}
            <div class="mb-3 rounded">
                <EventCardLarge {ndk} {eventData} />
            </div>
        {/each}
    </div>
    <div
        class="tab-pane fade"
        id="past"
        role="tabpanel"
        aria-labelledby="past-tab"
    >
        {#each Object.values($sortedPast) as eventData}
            <div class="mb-3 rounded">
                <EventCardLarge {ndk} {eventData} />
            </div>
        {/each}
    </div>
</div>
