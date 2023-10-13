<script lang="ts">
    import LinkedPfpIcon from "$lib/user/LinkedPFPIcon.svelte";
    import { community } from "../stores/store.community";

</script>
<!-- <small class="text-small"><a href="/" class="float-end pe-3">view all</a></small> -->
<h3 class="mt-2 ps-2 mb-1">Members ({$community.users.members?.length || 0}) </h3>
<div>
    {#if $community.users.members}
    {#each $community.users.members?.slice(0, 10) as member}
    <div class="p-1 float-start">
        <LinkedPfpIcon npub={member} />
    </div>
    {/each}
    {/if}
</div>


