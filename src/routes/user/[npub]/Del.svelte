<script lang="ts">
    import ndk from "$lib/ndk";
    import { deleteEvent } from "$lib/nostr";
    import { userHex } from "$lib/stores";
    import type { NDKEvent } from "@nostr-dev-kit/ndk";

    export let npub: string | undefined;

    let mevents: NDKEvent[] = [];

    $: fetchE(),  npub


    async function fetchE() {
        if (!ndk || !$userHex) return;

        let sub = ndk.subscribe(
            {
                kinds: [1073, 10037, 30037, 1037, 30073, 30042],
                authors: [$userHex],
            },
            { closeOnEose: false }
        );
        
        sub.on("event", (e: NDKEvent) => {
            console.log(e)
            mevents.push(e);
            mevents = [...mevents, e]
        });
    }
    fetchE()
    
    function del(id:string){
        if(!ndk) return;
        deleteEvent(ndk,id)
    }
</script>
<h1>events</h1>
{#if ndk && mevents && mevents.length > 0}
    {#each mevents as e}
        <p>
            <button on:click={() => del(e.id)}>{e.id}</button>
            {e.kind} :: {e.content} // {JSON.stringify(e.tags)}</p>
    {/each}
{:else}
    <p>No events available.</p>
{/if}