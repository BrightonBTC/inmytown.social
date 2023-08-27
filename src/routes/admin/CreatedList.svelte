<script>
    import { dateStringFull } from "$lib/formatDates";
    import { imgUrlOrDefault } from "$lib/helpers";


    import { sortedCommunities } from "./stores";

</script>
<h3 class="mb-4">
    Communities you've created:
    <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#addCommunityModal"
    >
        +
    </button>
</h3>

<table class="table table-hover">
    <thead>
        <tr>
            <th></th>
            <th>Community Page</th>
            <th>Community Events</th>
            <th>Community Details</th>
        </tr>
    </thead>
    <tbody>
        {#each Object.values($sortedCommunities) as community}
            <tr class="align-middle">
                <td>
                    <img
                        src={imgUrlOrDefault(community.image)}
                        alt={community.title}
                        class="mini-banner rounded-circle"
                    />
                </td>
                <td>
                    <a href="/community/{community.eid}"
                        >{community.title}</a
                    >
                    <br><small class="text-muted">updated: {dateStringFull(community.updated)}</small>
                </td>
                <td>
                    <a href="/events/{community.eid}">manage</a>
                </td>
                <td class="text-center">
                    <a href="/community/edit/{community.eid}">
                        <i
                            class="bi bi-pencil-square text-primary"
                        />
                    </a>
                </td>
            </tr>
        {/each}
    </tbody>
</table>

<style>
    i {
        font-size: 1.3rem;
    }
    .mini-banner {
        width: 40px;
        height: 40px;
        object-fit: cover;
    }
</style>