<script lang="ts">
    import LinkedPfpIcon from "$lib/user/LinkedPFPIcon.svelte";
    import { communityMembers } from "./store.community";
    import ndk from "$lib/ndk";

</script>
<small class="text-small"><a href="/" class="float-end pe-3">view all</a></small>
<h3 class="mt-2 ps-2">Members ({$communityMembers.length}) </h3>
<div class="p-1">
    {#each $communityMembers.slice(0, 10) as member}
    <div class="p-2 float-start">
        <LinkedPfpIcon npub={member} {ndk} />
    </div>
    {/each}
</div>


