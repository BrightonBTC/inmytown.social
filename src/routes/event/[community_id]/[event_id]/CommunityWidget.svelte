<script lang="ts">
    import CommunityCard from "$lib/community/CommunityCard.svelte";
    import { meetupStore } from "./stores";
</script>

<p class="ms-3 mb-2 text-muted">An event from:</p>
<CommunityCard communityDetails={$meetupStore.meta.community} />
