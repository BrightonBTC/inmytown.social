<script lang="ts">
    import "bootstrap-icons/font/bootstrap-icons.css";
    import { getBadgeClassByStatus } from "$lib/helpers";
    import Loading from "$lib/Loading.svelte";
    import { dateStringFull } from "$lib/formatDates";
    import type { EventMeta } from "$lib/event/event";
    export let event: EventMeta ;
    export let community_id: string ;

</script>

<tr>
    {#if event}
        <td><span class="badge {getBadgeClassByStatus(event.status)}">{event.status}</span></td>
        <td
            ><small class="text-muted"
                >{dateStringFull(event.starts)}</small
            ></td
        >
        <td><a href="/event/{community_id}/{event.eid}">{event.title}</a></td>
        <td
            ><a href="/event/{community_id}/{event.eid}/edit">
                <i class="bi bi-pencil-square text-primary" />
            </a></td
        >
    {:else}
        <td colspan="4"><Loading /></td>
    {/if}
</tr>

