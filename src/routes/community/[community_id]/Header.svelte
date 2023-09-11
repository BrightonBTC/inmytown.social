<script lang="ts">
    import "bootstrap-icons/font/bootstrap-icons.css";
    import { communityMembers, removeMember } from "./store.community";
    import { uStatus, userStatus, userNpub } from "$lib/stores";
    import LinkedPfpIcon from "$lib/user/LinkedPFPIcon.svelte";
    import { imgUrlOrDefault } from "$lib/helpers";
    import UserName from "$lib/user/UserName.svelte";
    import type { NDKUser } from "@nostr-dev-kit/ndk";
    import { publishUserStatus } from "$lib/user/user";
    import Location from "$lib/location/Location.svelte";
    import ndk from "$lib/ndk";
    import {community} from "./store.community";

    export let host: NDKUser | undefined;
    let isFollower: boolean = false;

    $: isFollower = (uStatus.communities?.find(el => el === $community.meta.eid)) ? true: false, $communityMembers;

    async function joinNow(){
        uStatus.communities.push($community.meta.eid);
        publishUserStatus(ndk, uStatus)
        userStatus.set(JSON.stringify(uStatus));
    }
    async function leaveNow(){
        uStatus.communities.splice(uStatus.communities?.findIndex(e => e[1] === $community.meta.eid),1);
        publishUserStatus(ndk, uStatus)
        userStatus.set(JSON.stringify(uStatus));
        if($userNpub) removeMember($userNpub)
    }

</script>


<div class="card mb-3 p-1 shadow-sm">
    <div class="row g-0">
        <div class="col-lg-8">
            <img
            src={imgUrlOrDefault($community.meta.image)}
            alt="musig"
            class="img-fluid rounded header-image"
            />
        </div>
        <div class="col-lg-4">
            
            <div class="card-body">
                <h1 class="card-title"><b>{$community.meta.title}</b></h1>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                        <Location city={$community.meta.city} country={$community.meta.country} />
                    </li>
                    <li class="list-group-item">
                        <i class="bi bi-people me-2 text-primary"></i> {$communityMembers.length} Members
                    </li>
                    {#if host}
                    <li class="list-group-item">
                        <i class="bi bi-person me-2 text-primary"></i> 
                        <span>Hosted by</span>
                        <span><UserName user={host} /> <LinkedPfpIcon {ndk} cls="tiny" npub={host.npub} /> </span> 
                    </li>
                    {/if}
                </ul>
                <div class="text-center mt-3">
                    {#if isFollower}
                        <button type="button" class="btn btn-outline-success" data-bs-toggle="toggle" title="leave community?" on:click|preventDefault={() => leaveNow()}>
                            <i class="bi bi-person-check-fill"></i>
                            <span class="ms-2">Member</span>
                        </button>
                    {:else}
                        <button class="btn btn-primary" on:click|preventDefault={() => joinNow()}>Join Now</button>
                    {/if}
                </div>
                
            </div>
        </div>
        
    </div>
</div>

<style>
    .header-image {
        object-fit: cover; 
        width: 100%;
        height: 350px;
    }
    i{
        font-size:1.2rem;
    }
</style>