<script lang="ts">
    import LinkedPfpIcon from "$lib/user/LinkedPFPIcon.svelte";
    import { communityMembers } from "../stores/store.community";

</script>
<small class="text-small"><a href="/" class="float-end pe-3">view all</a></small>
<h3 class="mt-2 ps-2">Members ({$communityMembers?.length || 0}) </h3>
<div class="p-1">
    {#if $communityMembers}
    {#each $communityMembers?.slice(0, 10) as member}
    <div class="p-2 float-start">
        <LinkedPfpIcon npub={member} />
    </div>
    {/each}
    {/if}
</div>


