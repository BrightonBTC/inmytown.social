<script>
    import { getBadgeClassByStatus } from "$lib/helpers";


    import { eventMetaStore } from "./stores";

</script>

{#each ['draft', 'published', 'cancelled'] as status}
<div class="form-check">
    <input
        type="radio"
        class="form-check-input"
        id={status}
        name="eventStatus"
        value={status}
        bind:group={$eventMetaStore.status}
    />
    <label class="form-check-label" for={status}>
        <span class="badge {getBadgeClassByStatus(status)}">{status}</span>
    </label>
</div>

{/each}
