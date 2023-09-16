<script lang="ts">
    import { dateStringFull } from '$lib/formatDates';
    import { imgUrlOrDefault } from '$lib/helpers';
    import { MeetupEvent, type EventMeta } from './event';
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
                <h4 class="card-title"><a href="{MeetupEvent.url(eventData)}" class="text-decoration-none text-muted">{eventData.title}</a></h4>
                <p class="card-text text-muted">
                    <i class="bi bi-geo-alt me-2 text-primary"></i> {eventData.city}, {eventData.country}
                </p>
                <p class="card-text">
                    {eventData.brief}
                </p>
            </div>
        </div>
        <div class="col-md-4">
            <a href="{MeetupEvent.url(eventData)}"><img
                src={imgUrlOrDefault(eventData.image, 'event')}
                alt="musig"
                class="rounded event-image"
            />
            </a>
            
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