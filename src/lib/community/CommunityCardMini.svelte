<script lang="ts">
    import { imgUrlOrDefault } from "$lib/helpers";
    import { Community, type CommunityMeta } from "./community";

    export let communityDetails: CommunityMeta;
</script>
<div class="card shadow">
    <img
        class="card-img-top header-image"
        src={imgUrlOrDefault(communityDetails.image, 'community')}
        alt={communityDetails.title}
    />
    <div class="card-body">
        <h4 class="card-title">{communityDetails.title}</h4>
        <a
            href="{Community.url(communityDetails)}"
            class="btn btn-primary float-end">Go to community</a
        >
    </div>
</div>
<style>
    .header-image {
        object-fit: cover;
        width: 100%;
    }
</style>