<script lang="ts">
    import { type CommunityMeta, CommunitySubscriptions, Community } from "$lib/community/community";
    import { imgUrlOrDefault } from "$lib/helpers";
    import ndk from "$lib/ndk";

    export let id: string;

    let communityDetails: CommunityMeta;

    let communitySubs = new CommunitySubscriptions($ndk)
    communitySubs.subscribeByID(id, async (data) => {
        communityDetails = data;
    });
</script>

{#if communityDetails}
    <li class="list-group-item">
        <img
            src={imgUrlOrDefault(communityDetails.image)}
            alt={communityDetails.title}
            class="mini-banner rounded-circle me-3"
        />
        <a href="{Community.url(communityDetails)}">{communityDetails.title}</a>
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