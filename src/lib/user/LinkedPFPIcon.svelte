<script lang="ts">
    import PfpIcon from "./PFPIcon.svelte";
    export let npub: string | undefined;
    export let cls: string = ''; 
</script>
{#if npub}
<a href="/user/{npub}">
    <PfpIcon {npub} {cls} />
</a>
{/if}
