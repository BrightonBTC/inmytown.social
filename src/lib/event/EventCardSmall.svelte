<script lang="ts">
    import { dateStringFull } from '$lib/formatDates';
    import Tags from '$lib/topics/Tags.svelte';
    import type { EventMeta } from './event';
    export let eventData: EventMeta | null;
</script>
{#if eventData}


<div class="card mb-3 shadow">
    <div class="card-header">
        <h4 class="card-title mb-1"><a href="/event/{eventData.community.eid}/{eventData.uid}" class="text-decoration-none">{eventData.title} <small><i class="bi bi-link-45deg text-muted"></i></small></a> </h4>
    </div>
    <div class="card-body">
        <p class="card-text">
            {eventData.brief}
        </p>
        <ul class="list-group shadow-sm">
            <li class="list-group-item d-flex">
                <i class="bi bi-geo-alt me-2 text-primary" />
                <div class="ps-2">
                    {eventData.venue}<br /><small
                        >{eventData.city}, {eventData.country}</small
                    >
                </div>
            </li>
            <li class="list-group-item d-flex">
                <i class="bi bi-clock pe-2 text-primary" />
                <small class="ps-2 text-muted">
                    <strong>Starts:</strong>
                    {dateStringFull(eventData.starts)}<br />
                    <strong>Ends:</strong>
                    {dateStringFull(eventData.ends)}
                </small>
            </li>
        </ul>
    </div>
    <div class="card-footer">
        <Tags tags={eventData.tags} linked={true} />
    </div>
</div>
{/if}
