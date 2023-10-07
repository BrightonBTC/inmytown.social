<script lang="ts">
    import type { NDKUserProfile } from "@nostr-dev-kit/ndk";

    export let profile:NDKUserProfile
</script>
{#if profile.nip05}
    <span class="badge bg-dark p-2">
        {profile.nip05}
        {#if profile.nip05valid}
            <i class="bi bi-check text-light bg-success ps-1 pe-1 ms-2 rounded"></i>
        {:else}
            <i class="bi bi-exclamation-diamond text-dark bg-warning ps-1 pe-1 ms-2 rounded"></i>
        {/if}
    </span>
{/if}