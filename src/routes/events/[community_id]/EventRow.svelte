<script lang="ts">
    import "bootstrap-icons/font/bootstrap-icons.css";
    import type NDK from "@nostr-dev-kit/ndk";
    import { getBadgeClassByStatus } from "$lib/helpers";
    import Loading from "$lib/Loading.svelte";
    import { dateStringFull } from "$lib/formatDates";
    import { type EventMeta, subEventMeta } from "$lib/event/event";
    export let eid: string;
    export let ndk: NDK;
    let event: EventMeta | null;

    subEventMeta(ndk, eid, async (data) => {
        event = data
    })
</script>

<tr>
    {#if event}
        <td><span class="badge {getBadgeClassByStatus(event.status)}">{event.status}</span></td>
        <td
            ><small class="text-muted"
                >{dateStringFull(event.starts)}</small
            ></td
        >
        <td><a href="/event/{event.eid}">{event.title}</a></td>
        <td
            ><a href="/event/{event.eid}/edit">
                <i class="bi bi-pencil-square text-primary" />
            </a></td
        >
    {:else}
        <td colspan="4"><Loading /></td>
    {/if}
</tr>

