<script lang="ts">
    import { type CommunityMeta, CommunitySubscriptions, Community } from "$lib/community/community";
    import { imgUrlOrDefault } from "$lib/helpers";
    import Location from "$lib/location/Location.svelte";
    import ndk from "$lib/stores/ndk";

    export let id: string;

    let communityDetails: CommunityMeta;

    let communitySubs = new CommunitySubscriptions($ndk)
    communitySubs.subscribeByID(id, async (data) => {
        communityDetails = data;
    });
</script>

{#if communityDetails}
    <li class="list-group-item d-flex align-items-center">
        <img
            src={imgUrlOrDefault(communityDetails.image)}
            alt={communityDetails.title}
            class="mini-banner rounded-circle me-3"
        />
        <div>
            <a href="{Community.url(communityDetails)}" class="mb-2">{communityDetails.title}</a><br>
            <small><Location city={communityDetails.city} country={communityDetails.country} /></small>
        </div>
        
    </li>
{:else}
    <li class="list-group-item list-group-item-warning d-flex">
        <i class="bi bi-exclamation-triangle me-3" />
        <small>
            Failed to fetch community. You may need to connect to a different
            relay set to retrieve it.
            <br /> <small class="text-muted">{id}</small>
        </small>
    </li>
{/if}
<style>
    i {
        font-size: 1rem;
    }
    .mini-banner {
        width: 60px;
        height: 60px;
        object-fit: cover;
    }
</style>