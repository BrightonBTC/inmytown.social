<script lang="ts">
    import TagSelector from "$lib/topics/TagSelector.svelte";
    import Tags from "$lib/topics/Tags.svelte";
    import BriefInput from "./BriefInput.svelte";
    import DateSelectors from "./DateSelectors.svelte";
    import DescriptInput from "./DescriptInput.svelte";
    import ImageInput from "./ImageInput.svelte";
    import LocationOptions from "./LocationOptions.svelte";
    import StatusSelect from "./StatusSelect.svelte";
    import TitleInput from "./TitleInput.svelte";
    import { meetupStore } from "./stores";
    import { goto } from "$app/navigation";

    export let eid: string;

    async function publishEvent(){
        await $meetupStore.publish();
        console.log($meetupStore.error)
        //if(!$meetupStore.error) 
        //goto('/event/'+eid)
    }

    function updateTags(tags: string[]){
        $meetupStore.meta.tags = tags
    }
    
</script>
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
            <Tags tags={$meetupStore.meta.tags} linked={false} />
            <TagSelector callback={updateTags} tags={$meetupStore.meta.tags} />
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