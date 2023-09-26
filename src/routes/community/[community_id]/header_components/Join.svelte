<script lang="ts">
    import ndk from "$lib/stores/ndk";
    import { loggedInUser } from "$lib/stores/user";
    import { publishUserStatus } from "$lib/user/user";
    import { onMount } from "svelte";
    import { addMember, community, removeMember } from "../stores/store.community";
    import LoadingMini from "$lib/LoadingMini.svelte";

    let isFollower: boolean
    let fetched: boolean = false

    //$: isFollower = ($loggedInUser?.status?.communities?.find(el => el === $community.meta.eid)) ? true: false, $communityMembers;

    onMount(async () => {
        await $loggedInUser?.fetchStatus();
        isFollower = ($loggedInUser?.status?.communities?.find(el => el === $community.meta.eid)) ? true: false
        fetched = true;
    })

    async function joinNow(){
        if(!$loggedInUser?.status) return
        $loggedInUser?.status?.communities.push($community.meta.eid);
        publishUserStatus($ndk, $loggedInUser?.status)
        addMember($loggedInUser?.npub)
    }
    async function leaveNow(){
        if(!$loggedInUser?.status) return
        $loggedInUser?.status?.communities.splice($loggedInUser?.status?.communities?.findIndex(e => e[1] === $community.meta.eid),1);
        publishUserStatus($ndk, $loggedInUser?.status)
        removeMember($loggedInUser?.npub)
    }
</script>
<div class="text-center mt-3">
    {#if fetched}
        {#if isFollower}
            <button type="button" class="btn btn-outline-success" data-bs-toggle="toggle" title="leave community?" on:click|preventDefault={() => leaveNow()}>
                <i class="bi bi-person-check-fill"></i>
                <span class="ms-2">Member</span>
            </button>
        {:else}
            <button class="btn btn-primary" on:click|preventDefault={() => joinNow()}>Join Now</button>
        {/if}
    {:else if $loggedInUser}
        <LoadingMini />
    {/if}
</div>

<style>
    i{
        font-size:1.2rem;
    }
</style>