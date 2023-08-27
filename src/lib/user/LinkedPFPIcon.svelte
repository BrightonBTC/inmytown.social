<script lang="ts">
    import type NDK from "@nostr-dev-kit/ndk";
    import PfpIcon from "./PFPIcon.svelte";

    export let ndk: NDK | undefined;
    export let npub: string | undefined;
    export let cls: string = ''; 

    
</script>
{#if npub}
<a href="/user/{npub}">
    <PfpIcon {ndk} {npub} {cls} />
</a>
{/if}
