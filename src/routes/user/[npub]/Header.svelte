<script lang="ts">
    import Loading from "$lib/Loading.svelte";
    import type NDK from "@nostr-dev-kit/ndk";
    import type { NDKUser } from "@nostr-dev-kit/ndk";
    import { imgUrlOrDefault } from "$lib/helpers";
    import UserName from "$lib/user/UserName.svelte";
    import LinkedPfpIcon from "$lib/user/LinkedPFPIcon.svelte";
    import UserWebsite from "$lib/user/UserWebsite.svelte";
    import { fetchUser } from "$lib/user/user";
    import UserFollowBtn from "./UserFollowBtn.svelte";
    import ndk from "$lib/ndk";
    import { meetupUser } from "./stores";

    // export let ndk: NDK | undefined;
    // export let npub: string | undefined;
    // let user: NDKUser | undefined;


    // $: setUser(), npub

    // async function setUser(){
    //     user = undefined
    //     if(ndk && npub) user = await fetchUser(ndk, npub);
    // }

</script>
{#if $meetupUser?.profile}
<div class="card shadow-sm">
    <!-- <UserFollowBtn {ndk} {npub} /> -->
    <img class="card-img-top" src={imgUrlOrDefault($meetupUser.profile.banner)} alt="{$meetupUser.profile.name}" />
    <div class="card-body row ms-0 me-0 bg-secondary">
        <div class="uim text-center mb-3 col-lg-2">
            <LinkedPfpIcon {ndk} npub={$meetupUser.npub} cls="lg"/>
        </div>
        <div class="ps-4 col-lg-10">
            <h3 class="card-title mb-2"><span class="userName"><UserName user={$meetupUser} /></span></h3>
            {#if $meetupUser.profile.nip05}
                <span class="badge bg-dark p-2">
                    {$meetupUser.profile.nip05}
                    {#if $meetupUser.profile.nip05valid}
                        <i class="bi bi-check text-light bg-success ps-1 pe-1 ms-2 rounded"></i>
                    {:else}
                        <i class="bi bi-exclamation-diamond text-dark bg-warning ps-1 pe-1 ms-2 rounded"></i>
                    {/if}
                </span>
            {/if}
            <UserWebsite profile={$meetupUser.profile} />
            <div class="card-text mt-3">{$meetupUser.profile.about}</div>
            
        </div>
        
    </div>
</div>
{:else}
<Loading />
{/if}
<style>
    i{
        font-size: 1em;
        width:20px;
    }
    .uim{
        margin-top: -100px;
    }
    .userName{
        white-space: nowrap;
        text-overflow: ellipsis;
        display: block;
        overflow: hidden;
    }
    .card-img-top{
        object-fit: cover;
        width: 100%;
        max-height: 300px;
    }
</style>