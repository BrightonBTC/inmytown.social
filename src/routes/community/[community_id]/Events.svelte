<script lang="ts">
    import "bootstrap-icons/font/bootstrap-icons.css";
    import { sortedPast, sortedUpcoming } from "./stores/store.events";
    import EventCardLarge from "$lib/event/EventCardLarge.svelte";
</script>

<div class="p-2 mt-3">
    {#if $sortedUpcoming.length > 0}
    <h3>Upcoming events:</h3>
    {#each $sortedUpcoming as eventData}
        <EventCardLarge {eventData} />
    {/each}
    {:else}
        <hr />
        <p class="small text-muted"><em>-- No upcoming events --</em></p>
    {/if}
    {#if $sortedPast.length > 0}
    <h3>Past events:</h3>
    {#each $sortedPast as eventData}
        <EventCardLarge {eventData} />
    {/each}
    {:else}
        <hr />
        <p class="small text-muted"><em>-- No past events --</em></p>
    {/if}
</div>


