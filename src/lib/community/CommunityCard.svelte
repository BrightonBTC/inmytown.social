<script lang="ts">
    import { imgUrlOrDefault } from "$lib/helpers";
    import Location from "$lib/location/Location.svelte";
    import { Community, type CommunityMeta } from "./community";

    export let communityDetails: CommunityMeta;
</script>
<div class="card shadow">
    <a href="{Community.url(communityDetails)}">
        <img
            class="card-img-top header-image"
            src={imgUrlOrDefault(communityDetails.image, 'community')}
            alt={communityDetails.title}
        />
    </a>
    <div class="card-body">
        <h4 class="card-title mb-0">
            <a class="text-decoration-none text-muted" href="{Community.url(communityDetails)}">
                {communityDetails.title}
            </a>
        </h4>
    </div>
    <div class="card-footer small">
        <Location country={communityDetails.country} city={communityDetails.city} />
    </div>
</div>
<style>
    .header-image {
        object-fit: cover;
        width: 100%;
        aspect-ratio: 16/9;
    }
</style>