<script lang="ts">
    import type { UserStatus } from "$lib/user/user";
    import type NDK from "@nostr-dev-kit/ndk";
    import MemberItem from "./MemberItem.svelte";

    export let statusData: UserStatus | undefined;
    export let ndk: NDK | undefined;

    
    
    
</script>

<h3>Member of:</h3>
{#if statusData && ndk}
    <ul class="list-group">
        {#each statusData.communities as id}
            <MemberItem {ndk} {id} />
        {/each}
    </ul>
{/if}


