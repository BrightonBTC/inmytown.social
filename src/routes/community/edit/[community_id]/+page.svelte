<script lang="ts">
	import "bootstrap-icons/font/bootstrap-icons.css";
	import type { CommunityID } from "./+page";
	export let data: CommunityID;
	import { onMount } from "svelte";
	import { community } from "./stores";
	import Loading from "$lib/Loading.svelte";
	import CommunityCard from "./CommunityCard.svelte";
    import Form from "./Form.svelte";
	import {
    Community,
		CommunitySubscriptions,
	} from "$lib/community/community";
	import { login } from "$lib/user/user";
	import ndk from "$lib/ndk";
    import { loggedInUser } from "$lib/stores/user";

	let communitySubs = new CommunitySubscriptions($ndk);

	let isNew: boolean = false;
	let authorised: boolean | undefined;

	onMount(async () => {
		community.set(new Community($ndk))
		await login($ndk);

		if ($loggedInUser) {
			if (data.community_id === "new") {
				authorised = true;
				isNew = true;
				$community.newUID()
			} 
			else {
				fetchCommunity()
			}
		}
	});

	async function fetchCommunity() {
		communitySubs.subscribeByID(data.community_id, async (data) => {
			if (data.author === $loggedInUser?.npub) {
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


