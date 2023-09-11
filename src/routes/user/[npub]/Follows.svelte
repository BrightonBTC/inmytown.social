<script lang="ts">
    import type { NDKUser } from "@nostr-dev-kit/ndk";
    import UserCardSmallRow from "$lib/user/UserCardSmallRow.svelte";
    import { meetupUser } from "./stores";

    // export let npub: string;

    // let user: NDKUser | undefined;
    let follows: Set<NDKUser>;

    

    async function fetchFollows(){
        follows = await $meetupUser.follows();
    }

    $: fetchFollows(), $meetupUser

    // async function fetchFollows(){
    //     user = await fetchUser(ndk, npub);
    //     follows = await user?.follows()
    // }

</script>
{#if follows}
    {#each follows as f}
        <UserCardSmallRow npub={f.npub} />
    {/each}
{/if}
