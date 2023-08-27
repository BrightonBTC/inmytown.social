<script lang="ts">
    import { isValidUrl } from "$lib/helpers";
    import type { NDKUser, NDKUserProfile } from "@nostr-dev-kit/ndk";
    export let profile: NDKUserProfile | undefined = undefined;

    let w: URL | boolean;

    if (profile) {
        w = isValidUrl(profile?.website);
        console.log(w);
    }
</script>

{#if profile && typeof w !== "boolean"}
<span class="badge bg-dark  p-2">
    <i class="bi bi-link-45deg text-primary" /> <a href={w.href} target="_blank">{w.hostname}{w.pathname}</a>
</span>
{/if}
