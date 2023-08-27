<script lang="ts">
    import { onMount } from "svelte";
        import type NDK from '@nostr-dev-kit/ndk';
    import RelayAdder from "./RelayAdder.svelte";
    import { loadNDK } from "$lib/nostr";
    
    let ndk: NDK | undefined;

    onMount(async () => {
        ndk = await loadNDK();
    });
</script>

{#if ndk !== undefined}
    <RelayAdder />
{/if}