<script lang="ts">
    import Loading from "$lib/Loading.svelte";
    import { imgUrlOrDefault } from "$lib/helpers";
    import UserName from "$lib/user/UserName.svelte";
    import LinkedPfpIcon from "$lib/user/LinkedPFPIcon.svelte";
    import UserWebsite from "$lib/user/UserWebsite.svelte";
    import { meetupUser } from "./stores";
    import UserFollowBtn from "./UserFollowBtn.svelte";
    import { onMount } from "svelte";

    let imSize = 'lg'


    onMount(() => {
        getPageSize()
        window.onresize = getPageSize
    })

    function getPageSize(){
        const ps = window.matchMedia("(max-width: 800px)")
        if(ps.matches) imSize = 'md'
        else imSize = 'lg'
    }
</script>
{#if $meetupUser?.profile}
<div class="card shadow-sm">
    <UserFollowBtn />
    <img class="card-img-top {imSize}" src={imgUrlOrDefault($meetupUser.profile.banner, 'user-banner')} alt="{$meetupUser.profile.name}" />
    <div class="card-body row ms-0 me-0 bg-secondary">
        <div class="uim text-center mb-3 col-lg-2 {imSize}">
            <LinkedPfpIcon npub={$meetupUser.npub} cls={imSize}/>
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
    .uim.md{
        margin-top: -70px;
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
        aspect-ratio: 4/1;
    }
    .card-img-top.md{
        aspect-ratio: 5/2;
    }
</style>