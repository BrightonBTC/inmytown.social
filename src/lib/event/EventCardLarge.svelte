<script lang="ts">
import { dateStatusString, dateStringFull } from '$lib/formatDates';
    import { imgUrlOrDefault } from '$lib/helpers';
    import Tags from '$lib/topics/Tags.svelte';
    import Location from "$lib/location/Location.svelte";
    import { MeetupEvent, type EventMeta } from './event';
    import { Community, CommunitySubscriptions } from '$lib/community/community';
    import ndk from '$lib/ndk';

    export let eventData: EventMeta;
    export let eid:string | undefined = undefined

    let communitySubs = new CommunitySubscriptions($ndk);

    $: setData(), eid

    function setData(){
        communitySubs.subscribeByID(eventData.community.eid, async (data) => {
            if(data.eid === eventData.community.eid) eventData.community = data;
        })
    }

</script>
{#if eventData}
<p class="text-muted mb-2 mt-4">
    <small>{@html dateStatusString(eventData.starts, eventData.ends)} {dateStringFull(eventData.starts)} </small>
</p>

<div class="card mb-3 p-2 shadow">
    <div class="row g-0">
        <div class="col-md-8">
            <div class="card-body">
                <div class="d-flex align-items-center">
                    <img src="{imgUrlOrDefault(eventData.community.image)}" alt="{eventData.community.title}" class="cImg rounded-circle m-2 " />
                    <div class="ps-2">
                        <h4 class="card-title mb-1"><a href="{MeetupEvent.url(eventData)}" class="text-decoration-none text-muted">{eventData.title}</a> </h4>
                        <small>An event by <a href="{Community.url(eventData.community)}">{eventData.community.title}</a></small>
                    </div>
                </div>
                <hr />
                <p class="card-text text-muted">
                    <Location city={eventData.city} country={eventData.country} />
                </p>
                <p class="card-text">
                    {eventData.brief}
                </p>
            </div>
        </div>
        <div class="col-md-4 bg-secondary border rounded d-flex">
            <a href="{MeetupEvent.url(eventData)}" class="d-flex ">
                <img
                    src={imgUrlOrDefault(eventData.image, 'event')}
                    alt="musig"
                    class="rounded event-image"
                />
            </a>
        </div>
    </div>

    <div class="mt-2 p-2 pt-3 border-top">
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
    .event-image {
        object-fit: cover;
        width: 100%;
        min-height: 300px;
    }
</style>