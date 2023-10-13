<script lang="ts">

    import LoadingMini from "$lib/LoadingMini.svelte";
    import { community } from "../stores/store.community";

</script>
<li class="list-group-item">
    <i class="bi bi-people me-2 text-primary"></i> 
    {#if $community.users.members}
        {$community.users.members.length} Members
        {#if $community.users.followers && $community.users.followers.length > 0}
        <em class="text-muted small"> (+ {$community.users.followers.length} Followers)</em>
        {/if}
    {:else}
        <LoadingMini />
    {/if}
    
</li>

<style>
    i{
        font-size:1.2rem;
    }
</style>