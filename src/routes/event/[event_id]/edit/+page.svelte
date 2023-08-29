<script lang="ts">
	import "bootstrap-icons/font/bootstrap-icons.css";
    import type { MeetupEvent } from "./+page";
    export let data: MeetupEvent;
    import { onMount } from "svelte";
    import type { NDKEvent } from "@nostr-dev-kit/ndk";
    import { userHex, userNpub } from "$lib/stores";
    import Loading from "$lib/Loading.svelte";
    import TitleInput from "./TitleInput.svelte";
    import { eventMetaStore } from "./stores";
    import DescriptInput from "./DescriptInput.svelte";
    import ImageInput from "./ImageInput.svelte";
    import LocationOptions from "./LocationOptions.svelte";
    import DateSelectors from "./DateSelectors.svelte";
    import StatusSelect from "./StatusSelect.svelte";
    import BriefInput from "./BriefInput.svelte";
    import Tags from "$lib/topics/Tags.svelte";
    import EventCard from "$lib/event/EventCard.svelte";
    import { goto } from "$app/navigation";
    import { type EventMeta, publishEventMeta, subEventMeta } from "$lib/event/event";
    import { login } from "$lib/user/user";
    import TagSelector from "$lib/topics/TagSelector.svelte";
    import ndk from "$lib/ndk";

    let eid = data.event_id
    let authorised: boolean;
    let eventMeta: EventMeta;
    
    onMount(async () => {
        await login(ndk)

        if($userHex){
            subEventMeta(ndk, eid, async (data) => {
                eventMeta = data
                if (eventMeta.author === $userNpub) {
                    authorised = true;
                    eventMetaStore.set(eventMeta)
                    
                } else {
                    authorised = false;
                }
            })

        }
    });

    async function publishEvent(){
        let response: NDKEvent | string | null;
        response = await publishEventMeta(ndk, $eventMetaStore);
        goto('/event/'+data.event_id)
    }

    function updateTags(tags: string[]){
        $eventMetaStore.tags = tags
        $eventMetaStore = $eventMetaStore
    }
</script>
    {#if authorised === true}
        {#if $eventMetaStore && typeof eventMeta !== 'string' }
            <div class="row">
                <div class="col-sm-4 border-end border-top bg-secondary rounded">
                    <h1>Edit event</h1>
                    <EventCard eventData={eventMeta} />
                </div>

                <div class="col-sm-8">
                    <div class="p-2 bg-dark text-light border rounded">
                    <form on:submit|preventDefault={publishEvent}>
                        <div class="mb-3 mt-3">
                            <DateSelectors />
                        </div>
                        <div class="mb-3 mt-3">
                            <TitleInput />
                        </div>
                        <div class="mb-3 mt-3">
                            <BriefInput />
                        </div>
                        <div class="mb-3 mt-3">
                            <DescriptInput />
                        </div>
                        <div class="mb-3 mt-3 bg-secondary p-2 rounded d-flex">
                            <Tags tags={$eventMetaStore.tags} linked={false} />
                            <TagSelector callback={updateTags} tags={$eventMetaStore.tags} />
                        </div>
                        <div class="mb-3 mt-3">
                            <ImageInput />
                        </div>
            
                        <LocationOptions />
                        <div class="mb-3 mt-3">
                            <StatusSelect />
                        </div>
                        <div class="mb-3 mt-3">
                            <button type="submit">Submit</button>
                        </div>
                    </form>
                </div>
                </div>
            </div>
        {/if}
    {:else if authorised === false}
        <div class="alert alert-warning">
            <strong>Warning!</strong> You are not authorised to modify this community!
        </div>
    {:else}
        <Loading />
    {/if}
    