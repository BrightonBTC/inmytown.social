<script lang="ts">

    import LoadingMini from "$lib/LoadingMini.svelte";
    import { communityMembers } from "../stores/store.community";

</script>
<li class="list-group-item">
    <i class="bi bi-people me-2 text-primary"></i> 
    {#if $communityMembers}
        {$communityMembers.length} Members
    {:else}
        <LoadingMini />
    {/if}
    
</li>

<style>
    i{
        font-size:1.2rem;
    }
</style>