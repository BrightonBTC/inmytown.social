<script lang="ts">
    import type NDK from "@nostr-dev-kit/ndk";
    import type { NDKUser } from "@nostr-dev-kit/ndk";
    import { fetchUser } from "$lib/user/user";
    import UserCardSmallRow from "$lib/user/UserCardSmallRow.svelte";

    export let ndk: NDK | undefined;
    export let npub: string | undefined;

    let user: NDKUser | undefined;
    let follows: Set<NDKUser> | undefined;

    $: fetchFollows(), npub

    async function fetchFollows(){
        if(ndk && npub){
            user = await fetchUser(ndk, npub);
            follows = await user?.follows()
        } 
    }
</script>
{#if follows}
{#each follows as f}
<UserCardSmallRow {ndk} npub={f.npub} />
{/each}
{/if}
