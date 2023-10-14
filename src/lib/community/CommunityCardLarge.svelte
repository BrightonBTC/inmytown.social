<script lang="ts">
    import { imgUrlOrDefault } from "$lib/helpers";
    import Location from "$lib/location/Location.svelte";
    import Tags from "$lib/topics/Tags.svelte";
    import { Community, type CommunityMeta } from "./community";

    export let communityDetails: CommunityMeta;
</script>

<div class="card mb-4 shadow d-flex" style="width: 100%;">
    <a href="{Community.url(communityDetails)}">
        <img
            class="card-img-top header-image"
            src={imgUrlOrDefault(communityDetails.image, 'community')}
            alt={communityDetails.title}
        />
    </a>
    <div class="card-body">
        <h4 class="card-title overflow-e">
            <a
                class="text-decoration-none text-muted"
                href="{Community.url(communityDetails)}"
                >{communityDetails.title}</a
            >
        </h4>

        <ul class="list-group list-group-flush mt-3">
            <li class="list-group-item d-flex">
                <Location
                    city={communityDetails.city}
                    country={communityDetails.country}
                />
            </li>
            <li class="list-group-item overflow-em pt-3">
                <Tags tags={communityDetails.tags} linked={true} />
            </li>
        </ul>
    </div>
</div>

<style>
    .header-image {
        object-fit: cover;
        width: 100%;
        aspect-ratio: 16/9;
    }
    .overflow-e {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
