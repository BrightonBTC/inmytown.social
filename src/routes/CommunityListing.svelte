<script lang="ts"> 
    import Loading from '$lib/Loading.svelte';
    import CommunityCardLarge from '$lib/community/CommunityCardLarge.svelte';
    import { subCommunity, type CommunityMeta } from '$lib/community/community';
    import ndk from '$lib/ndk';
    import { onMount } from 'svelte';

    export let community:string

    let communityDetails: CommunityMeta

    onMount(async () => {

        subCommunity(ndk, community, async (data) => {
            communityDetails = data;
        });
    })
</script>
<div class="mb-0 d-flex">
    {#if communityDetails}
    <CommunityCardLarge {communityDetails} />
    {:else}
    <Loading />
    {/if}
</div>