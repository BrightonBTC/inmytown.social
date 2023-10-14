<script lang="ts">
	import "bootstrap-icons/font/bootstrap-icons.css";
	import type { CommunityID } from "./+page";
	export let data: CommunityID;
	import { onMount } from "svelte";
	import { community } from "./stores";
	import Loading from "$lib/Loading.svelte";
	import CommunityCard from "./CommunityCard.svelte";
	import Form from "./Form.svelte";
	import { Community } from "$lib/community/community";
	import { login } from "$lib/user/user";
	import ndk from "$lib/stores/ndk";
	import { loggedInUser } from "$lib/stores/user";
	import MainContent from "$lib/MainContent.svelte";

	let isNew: boolean = false;
	let authorised: boolean | undefined;

	onMount(async () => {
		community.set(new Community($ndk));
		await login($ndk);

		if ($loggedInUser) {
			if (data.community_id === "new") {
				authorised = true;
				isNew = true;
				$community.newUID();
			} else {
				fetchCommunity();
			}
		}
	});

	async function fetchCommunity() {
		let result = await $community.fetchMeta(data.community_id);
		if (result && result.author === $loggedInUser?.npub) {
			authorised = true;
		} else {
			authorised = false;
		}
	}
</script>

<MainContent>
	{#if authorised === true}
		{#if $community.meta}
			<div class="row">
				<div
					class="col-sm-4 border-end border-top bg-secondary rounded"
				>
					<CommunityCard {isNew} communityDetails={$community.meta} />
				</div>

				<div class="col-sm-8">
					<Form {isNew} />
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
</MainContent>
