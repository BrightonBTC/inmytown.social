<script lang="ts"> 
    import Loading from '$lib/Loading.svelte';
    import CommunityCardLarge from '$lib/community/CommunityCardLarge.svelte';
    import { subCommunity, type CommunityMeta } from '$lib/community/community';
    import ndk from '$lib/ndk';

    export let community:string

    console.log('community', community)

    let communityDetails: CommunityMeta

    $: loadCommunity(), community;

    async function loadCommunity() {
        subCommunity(ndk, community, async (data) => {
            communityDetails = data;
        });
    }
</script>
<div class="mb-0 d-flex">
    {#if communityDetails}
    <CommunityCardLarge {communityDetails} />
    {:else}
    <Loading />
    {/if}
</div>