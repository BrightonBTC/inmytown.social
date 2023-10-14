<script lang="ts">
    import type { NDKUser } from "@nostr-dev-kit/ndk";
    import UserCardSmallRow from "$lib/user/UserCardSmallRow.svelte";
    import { meetupUser } from "./stores";
    import UserName from "$lib/user/UserName.svelte";

    let follows: Set<NDKUser>;

    async function fetchFollows(){
        follows = await $meetupUser.follows();
    }

    $: fetchFollows(), $meetupUser

</script>
{#if follows}
<p>Found {follows.size} accounts across the Nostrverse that <UserName user={$meetupUser} /> is following:</p>
    {#each follows as f}
        <UserCardSmallRow npub={f.npub} />
    {/each}
{/if}
