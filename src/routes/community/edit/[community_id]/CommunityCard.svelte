<script lang="ts">
    import CommunityCard from "$lib/community/CommunityCard.svelte";
    import type { CommunityMeta } from "$lib/community/community";
    export let isNew:boolean;
    export let communityDetails: CommunityMeta;
</script>

    <h1>
        {#if isNew}
            Create community
        {:else}
            Edit community.
        {/if}
    </h1>
    {#if !isNew}
        <CommunityCard {communityDetails} />
    {/if}