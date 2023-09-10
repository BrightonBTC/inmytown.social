<script lang="ts">
    import { dateStringFull } from "$lib/formatDates";
    import { imgUrlOrDefault } from "$lib/helpers";
    import { addCommunity, communitiesStore, sortedCommunities } from "./stores";
    import { NDKUser, type NDKEvent, type NDKFilter } from "@nostr-dev-kit/ndk";
    import type NDK from "@nostr-dev-kit/ndk";
    import { userHex } from "$lib/stores";
    import CommunityCardLarge from "$lib/community/CommunityCardLarge.svelte";

    export let ndk: NDK | undefined;
    export let isLoggedInUser: boolean;
    export let npub: string;

    $: getList(), npub

    async function getList(){
        communitiesStore.set([])
        let hex: string | undefined;
        if(isLoggedInUser){
            hex = $userHex
        }
        else{
            let n = new NDKUser({npub: npub})
            hex = n.hexpubkey();
        }
        if(ndk && hex){
            const filter: NDKFilter = {
                kinds: [30037],
                authors: [hex],
            };
            const communitiesSub = ndk.subscribe(filter, {
                closeOnEose: true,
            });
            communitiesSub.on("event", (event: NDKEvent) => {
                addCommunity(event);
            });
        }
    }
</script>
{#if isLoggedInUser}
<h3 class="mb-4">
    Communities you've created:

    <a href="/community/edit/new"
        type="button"
        class="btn btn-primary"
    >
        +
</a>
</h3>
<table class="table table-hover">
    <thead>
        <tr>
            <th></th>
            <th>Community Page</th>
            <th>Community Events</th>
            <th>Community Details</th>
        </tr>
    </thead>
    <tbody>
        {#each Object.values($sortedCommunities) as community}
            <tr class="align-middle">
                <td>
                    <img
                        src={imgUrlOrDefault(community.image)}
                        alt={community.title}
                        class="mini-banner rounded-circle"
                    />
                </td>
                <td>
                    <a href="/community/{community.eid}"
                        >{community.title}</a
                    >
                    <br><small class="text-muted">updated: {dateStringFull(community.updated)}</small>
                </td>
                <td>
                    <a href="/events/{community.eid}">manage</a>
                </td>
                <td class="text-center">
                    <a href="/community/edit/{community.eid}">
                        <i
                            class="bi bi-pencil-square text-primary"
                        />
                    </a>
                </td>
            </tr>
        {/each}
    </tbody>
</table>

{:else if $sortedCommunities.length > 0}
<h3 class="mb-4">
    Administrator of:
</h3>
<div class="p-4 d-flex flex-column bg-secondary rounded">
{#each Object.values($sortedCommunities) as communityDetails}
    <CommunityCardLarge {communityDetails} />
{/each}
</div>
{/if}
<style>
    i {
        font-size: 1.3rem;
    }
    .mini-banner {
        width: 40px;
        height: 40px;
        object-fit: cover;
    }
    .d-flex{
        gap:20px;
    }
</style>