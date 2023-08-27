<script lang="ts">
    import { imgUrlOrDefault } from "$lib/helpers";
    import type { CommunityMeta } from "./community";

    export let communityDetails: CommunityMeta;
</script>
<div class="card">
    <img
        class="card-img-top header-image"
        src={imgUrlOrDefault(communityDetails.image)}
        alt={communityDetails.title}
    />
    <div class="card-body">
        <h4 class="card-title">{communityDetails.title}</h4>
        <a
            href="/community/{communityDetails.eid}"
            class="btn btn-primary float-end">Go to community</a
        >
    </div>
</div>
<style>
    .header-image {
        object-fit: cover;
        width: 100%;
        height: 130px;
    }
</style>