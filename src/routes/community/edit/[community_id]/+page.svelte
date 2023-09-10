<script lang="ts">
	import "bootstrap-icons/font/bootstrap-icons.css";
	import type { Community } from "./+page";
	export let data: Community;
	import { onMount } from "svelte";
	import { community } from "./stores";
	import { userHex, userNpub } from "$lib/stores";
	import Loading from "$lib/Loading.svelte";
	import CommunityCard from "./CommunityCard.svelte";
    import Form from "./Form.svelte";
	import {
		CommunitySubscriptions,
	} from "$lib/community/community";
	import { login } from "$lib/user/user";
	import ndk from "$lib/ndk";

	let communities = new CommunitySubscriptions(ndk);

	let loggedin: boolean;
	let isNew: boolean = false;
	let authorised: boolean | undefined;

	onMount(async () => {
		loggedin = await login(ndk);

		if (loggedin && $userHex) {
			if (data.community_id === "new") {
				authorised = true;
				isNew = true;
			} 
			else {
				fetchCommunity()
			}
		}
	});

	async function fetchCommunity() {
		communities.subscribeByID(data.community_id, async (data) => {
			if (data.author === $userNpub) {
				authorised = true;
				$community.meta = data
			} else {
				authorised = false;
			}
		});
	}

</script>

{#if authorised === true}
	{#if $community.meta}

		<div class="row">

			<div class="col-sm-4 border-end border-top bg-secondary rounded">
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


