<script lang="ts">
    import { dateStringFull } from '$lib/formatDates';
    import { imgUrlOrDefault } from '$lib/helpers';
    import Tags from '$lib/topics/Tags.svelte';
    import EventEndedAlert from './EventEndedAlert.svelte';
    import { MeetupEvent, type EventMeta } from './event';
    export let eventData: EventMeta | null;
</script>
{#if eventData}
<p class="text-muted mb-2 mt-4">
    <small>{dateStringFull(eventData.starts)}</small>
</p>

<div class="card mb-3 p-2 shadow">
    <div class="card-body">
        <EventEndedAlert starts={eventData.starts} ends={eventData.ends} />
        <h4 class="card-title"><a href="{MeetupEvent.url(eventData)}" class="text-decoration-none text-muted">{eventData.title}</a></h4>
        <p class="card-text text-muted">
            <i class="bi bi-geo-alt me-2 text-primary"></i> {eventData.city}, {eventData.country}
        </p>
        <p class="card-text">
            {eventData.brief}
        </p>
    </div>
    <a href="{MeetupEvent.url(eventData)}">
        <img
            src={imgUrlOrDefault(eventData.image, 'event')}
            alt="musig"
            class="rounded event-image"
        />
    </a>
    <div class="mt-2 p-2 pt-3 border-top">
        <Tags tags={eventData.tags} linked={true} />
    </div>
</div>
{/if}
<style>
    .event-image {
        object-fit: cover;
        width: 100%;
        aspect-ratio: 16/9;
    }
</style>