<script lang="ts">
    import type { NDKUser } from "@nostr-dev-kit/ndk";
    import UserCardSmallRow from "$lib/user/UserCardSmallRow.svelte";
    import { meetupUser } from "./stores";

    let follows: Set<NDKUser>;

    async function fetchFollows(){
        follows = await $meetupUser.follows();
    }

    $: fetchFollows(), $meetupUser

</script>
{#if follows}
    {#each follows as f}
        <UserCardSmallRow npub={f.npub} />
    {/each}
{/if}
