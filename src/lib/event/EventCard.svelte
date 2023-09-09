<script lang="ts">
    import { dateStringFull } from '$lib/formatDates';
    import { imgUrlOrDefault } from '$lib/helpers';
    import type { EventMeta } from './event';
    export let eventData: EventMeta | null;
</script>
{#if eventData}
<p class="text-muted mb-2 mt-4">
    <small>{dateStringFull(eventData.starts)}</small>
</p>

<div class="card mb-3 p-2 shadow">
    <div class="row g-0">
        <div class="col-md-8">
            <div class="card-body">
                <h4 class="card-title">{eventData.title}</h4>
                <p class="card-text text-muted">
                    <i class="bi bi-geo-alt me-2 text-primary"></i> {eventData.city}, {eventData.country}
                </p>
                <p class="card-text">
                    {eventData.brief}
                </p>
                <p class="card-text">
                    <a href="/event/{eventData.eid}" class="btn btn-primary"
                        >View event page</a
                    >
                </p>
            </div>
        </div>
        <div class="col-md-4">
            <img
                src={imgUrlOrDefault(eventData.image)}
                alt="musig"
                class="rounded event-image"
            />
        </div>
    </div>
</div>
{/if}
<style>
    .event-image {
        object-fit: cover;
        width: 100%;
        height: 250px;
    }
</style>