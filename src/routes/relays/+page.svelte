<script lang="ts">
    import ndk from "$lib/ndk";
    import RelayAdder from "./RelayAdder.svelte";
    
</script>

{#if ndk !== undefined}
    <RelayAdder />
{/if}