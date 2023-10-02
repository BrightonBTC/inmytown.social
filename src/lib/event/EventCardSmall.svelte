<script lang="ts">
    import { Community, CommunitySubscriptions } from '$lib/community/community';
    import { dateStatusString, dateStringFull } from '$lib/formatDates';
    import { imgUrlOrDefault } from '$lib/helpers';
    import ndk from '$lib/stores/ndk';
    import Tags from '$lib/topics/Tags.svelte';
    import { MeetupEvent, type EventMeta } from './event';

    export let eventData: EventMeta;
    export let eid:string | undefined = undefined

    $: setData(), eid

    let communitySubs = new CommunitySubscriptions($ndk); 

    function setData(){
        communitySubs.subscribeByID(eventData.community.eid, async (data) => {
            if(data.eid === eventData.community.eid) eventData.community = data;
        })
    }
</script>
{#if eventData}

<div class="card mb-3 shadow">
    <div class="card-header d-flex align-items-center">
        <img src="{imgUrlOrDefault(eventData.community.image)}" alt="{eventData.community.title}" class="cImg rounded-circle m-2 " />
        <div class="ps-2">
            <h4 class="card-title mb-1"><a href="{MeetupEvent.url(eventData)}" class="text-decoration-none text-muted">{eventData.title}</a> </h4>
            <small>An event by <a href="{Community.url(eventData.community)}">{eventData.community.title}</a></small>
        </div>
    </div>
    <div class="card-body">
        {@html dateStatusString(eventData.starts, eventData.ends)}
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
<style>
    .cImg{
        width: 50px;
        height: 50px;
        object-fit: cover;
    }
</style>