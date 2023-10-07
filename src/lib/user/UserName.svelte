<script lang="ts">
    import type { NDKUser } from "@nostr-dev-kit/ndk";
    export let user: NDKUser | undefined = undefined;

    let npub: string = '';
    if(user)
        npub = user.npub.substring(0, 10) + '...' + user.npub.substring(user.npub.length -3)
</script>


    {#if user?.profile}
    <a href="/user/{user.npub}" class="text-decoration-none">
        {user.profile?.displayName ||
                    user.profile?.name ||
                    user.profile?.nip05 ||
                    npub}
    </a>
    {/if}
