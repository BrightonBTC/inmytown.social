<script lang="ts">
    import "bootstrap-icons/font/bootstrap-icons.css";
    import { onMount } from "svelte";
    import type NDK from "@nostr-dev-kit/ndk";
    import { getBadgeClassByStatus } from "$lib/helpers";
    import Loading from "$lib/Loading.svelte";
    import { dateStringFull } from "$lib/formatDates";
    import { fetchEvent, type EventMeta } from "$lib/event/event";
    export let eid: string;
    export let ndk: NDK;
    let data: EventMeta | string | null;
    let err: string | null;
    let event: EventMeta | null;

    onMount(() => {
        (async () => {
            data = await fetchEvent(ndk, eid);
            if (typeof data === "string") {
                err = data;
            } else if (data) {
                event = data;
            }
        })();
    });
</script>

<tr>
    {#if err}
        <td colspan="4">{err}</td>
    {:else if event}
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

