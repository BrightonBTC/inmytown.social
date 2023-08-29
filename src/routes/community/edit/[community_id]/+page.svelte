<script lang="ts">
	import "bootstrap-icons/font/bootstrap-icons.css";
	import type { Community } from "./+page";
	export let data: Community;
	import { onMount } from "svelte";
	import {
    communityMetaStore
	} from "./stores";
	import NameInput from "./NameInput.svelte";
	import DescriptInput from "./DescriptInput.svelte";
	import LocationSelect from "./LocationSelect.svelte";
	import TagsSelect from "./TagsSelect.svelte";
	import ImageInput from "./ImageInput.svelte";
	import { userHex, userNpub } from "$lib/stores";
	import Loading from "$lib/Loading.svelte";
    import { goto } from "$app/navigation";
    import { type CommunityMeta, publishCommunityMeta, CommunityMetaDefaults, validateCommunityMeta, subCommunity } from "$lib/community/community";
    import { login } from "$lib/user/user";
    import CommunityCard from "$lib/community/CommunityCard.svelte";
    import { NDKEvent } from "@nostr-dev-kit/ndk";
    import ndk from "$lib/ndk";

    let loggedin: boolean;
    let isNew: boolean = false;

	let communityMeta: CommunityMeta | undefined | null = undefined;

	let authorised: boolean | undefined;
	onMount(async () => {
		loggedin = await login(ndk)

		if(loggedin && $userHex){
			if(data.community_id === 'new'){
				communityMeta = {
				...CommunityMetaDefaults
				}
				communityMetaStore.set(communityMeta)
				authorised = true;
				isNew = true;
			}
			else{
				subCommunity(ndk, data.community_id, async (data) => {
					if (data.author === $userNpub) {
						authorised = true;
						communityMetaStore.set(data)
					}
					else {
						authorised = false;
					}
				});
			}
		}
	});

	async function createCommunity(){
		if(ndk){
			const ndkEvent = new NDKEvent(ndk);
			ndkEvent.kind = 1037;
			await ndkEvent.publish();
			return ndkEvent.id
		}
		return false;
	}

	async function createCommunityChat(id:string){
		if(ndk){
			const ndkEvent = new NDKEvent(ndk);
			ndkEvent.kind = 40;
			ndkEvent.tags.push(["e", id])
			ndkEvent.content = JSON.stringify({
				name: $communityMetaStore.title,
				about: 'Public channel for meetup group: '+$communityMetaStore.title,
				picture: $communityMetaStore.image
			})
			await ndkEvent.publish();
		}
	}

	async function submitCommunity() {
		if(ndk){
			if(isNew){
				communityMeta = validateCommunityMeta($communityMetaStore);
				if(communityMeta.error) return;
				let created = await createCommunity();
				if(created){
					await createCommunityChat(created)
					communityMeta.eid = created
					communityMeta.uid = Math.round(Date.now()).toString(16)
				}
			}
			communityMeta = await publishCommunityMeta(ndk, $communityMetaStore);
			if(!communityMeta.error)
				goto('/community/'+communityMeta.eid)
		}
	}
</script>

	{#if authorised === true} 
		{#if $communityMetaStore}
		<div class="row">
			<div class="col-sm-4 border-end border-top bg-secondary rounded">
				<h1>
					{#if isNew}
					Create community
					{:else}
					Edit community.
					{/if}
				</h1>
				{#if !isNew}
				<CommunityCard communityDetails={$communityMetaStore} />
				{/if}
			</div>

			<div class="col-sm-8">
				<form on:submit|preventDefault={submitCommunity}>
					<div class="mb-3 mt-3">
						<NameInput />
					</div>

					<div class="mb-3 mt-3">
						<DescriptInput />
					</div>

					<div class="mb-3 mt-3">
						<span class="text-muted">Tags:</span>
						{#each $communityMetaStore.tags as t}
							<span class="badge rounded-pill bg-info me-1">#{t}</span>
						{/each}
						<i
							class="bi bi-pencil-fill text-primary"
							data-bs-toggle="modal"
							data-bs-target="#tagsModal"
						/>
					</div>
					<div class="mb-3 mt-3">
						<ImageInput />
					</div>

					<LocationSelect />
					{#if $communityMetaStore.error}
					<div class="mb-3 mt-3">
						<span class="alert alert-warning">{$communityMetaStore.error}</span>
					</div>
					{/if}
					<button type="submit" class="btn btn-primary">Submit</button>
				</form>
				<TagsSelect />
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

<style>
	i {
		font-size: 0.8rem;
		cursor: pointer;
	}
</style>
