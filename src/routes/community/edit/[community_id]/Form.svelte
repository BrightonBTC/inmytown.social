<script lang="ts">
	import TagsSelect from "./TagsSelect.svelte";
    import { community } from "./stores";
    import { goto } from "$app/navigation";
    import FormTitle from "./FormTitle.svelte";
    import FormDescription from "./FormDescription.svelte";
    import FormImage from "./FormImage.svelte";
    import FormLocation from "./FormLocation.svelte";
    import Tags from "./Tags.svelte";
    import FormError from "./FormError.svelte";

    export let isNew:boolean;

    async function submitCommunity() {
        $community.validate();
        if($community.meta.error) return;
		if(isNew){
			let created = await $community.create();
			if(created) await $community.createChat();
		}
		await $community.publishMeta();
		//if (!$community.meta.error) 
        goto("/community/" + $community.meta.eid);
	}

</script>

<form on:submit|preventDefault={submitCommunity}>

    <div class="mb-3 mt-3">
        <FormTitle />
    </div>

    <div class="mb-3 mt-3">
        <FormDescription />
    </div>

    <div class="mb-3 mt-3">
        <Tags />
    </div>

    <div class="mb-3 mt-3">
        <FormImage />
    </div>

    <FormLocation />

    <FormError />

    <button type="submit" class="btn btn-primary mt-2 float-end">Submit</button>

</form>

<TagsSelect />
