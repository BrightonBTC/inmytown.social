<script lang="ts">
    import { dateStringFull } from "$lib/formatDates";
    import { meetupStore } from "./stores";
    import Map from "./Map.svelte"
    import Tags from "$lib/topics/Tags.svelte";
</script>

<ul class="list-group list-group-flush mt-3">
    <li class="list-group-item d-flex">
        <i class="bi bi-clock pe-2 text-primary" />
        <small class="ps-2 text-muted">
            <strong>Starts:</strong>
            {dateStringFull($meetupStore.meta.starts)}<br />
            <strong>Ends:</strong>
            {dateStringFull($meetupStore.meta.ends)}
        </small>
    </li>
    <li class="list-group-item d-flex">
        <i class="bi bi-geo-alt me-2 text-primary" />
        <div class="ps-2">
            {$meetupStore.meta.venue}<br /><small
                >{$meetupStore.meta.city}, {$meetupStore.meta.country}</small
            >
        </div>
    </li>
    <li class="list-group-item">
        <Map />
    </li>
    <li class="list-group-item">
        <Tags tags={$meetupStore.meta.tags} linked={true} />
    </li>
</ul>