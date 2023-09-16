<script lang="ts">
    import CommunityCard from "$lib/community/CommunityCard.svelte";
    import { type CommunityMeta, CommunitySubscriptions } from "$lib/community/community";
    import ndk from "$lib/ndk";
    import { meetupStore } from "./stores";

    let communityDetails: CommunityMeta;

    let communitySubs = new CommunitySubscriptions(ndk);

    communitySubs.subscribeByID($meetupStore.meta.community.eid, async (data) => {
        communityDetails = data;
    });

</script>
<p class="ms-3 mb-2 text-muted">An event from:</p>

{#if communityDetails}
    <CommunityCard {communityDetails} />
{/if}