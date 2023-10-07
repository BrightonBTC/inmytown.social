<script lang="ts">
    import Loading from "$lib/Loading.svelte";
    import { imgUrlOrDefault } from "$lib/helpers";
    import UserName from "./UserName.svelte";
    import type { MeetupUser } from "./user";
    import Nip5 from "./Nip5.svelte";
    import UserWebsite from "./UserWebsite.svelte";
    import FollowButton from "./FollowButton.svelte";

    export let user: MeetupUser | undefined = undefined;

    let webClients = [
        ['iris.to', '/'],
        ['primal.net', '/p/'],
        ['coracle.social', '/'],
        ['nostree.me', '/'],
    ]
    let selected:string;

</script>
{#if user?.profile}
<div class="card shadow">
    <FollowButton {user} />
    <a href="/user/{user.npub}">
        <img class="card-img-top rounded-circle p-4" src={imgUrlOrDefault(user.profile.image)} alt="{user.profile.name} photo" />
    </a>
    <div class="card-body text-center">
        <h5 class="card-title"><span class="ellip"><UserName {user} /></span></h5>
        <p class="small ellip"><span class="ellip"><Nip5 profile={user.profile} /></span></p>
        <p class="card-text py-2">{user.profile.about}</p>
        <p class="small"><span class="ellip"><UserWebsite profile={user.profile} /></span></p>
        <a href="nostr://{user.npub}" class="btn btn-secondary mb-3">Open profile in native client</a>
        <select class="form-select m-1" bind:value={selected} on:change={() => {window.open(selected), selected=''}}>
            <option value="">Open profile in external web client</option>
            {#each webClients as link}
                <option value="https://{link[0]}{link[1]}{user.npub}">{link[0]}</option>
            {/each}
        </select>
    </div>
    
</div>

{:else}
<Loading />
{/if}
<style>
    .card-img-top{
        object-fit: cover;
        width: 100%;
        aspect-ratio: 1/1;
    }
    .ellip{
        white-space: nowrap;
        text-overflow: ellipsis;
        display: block;
        overflow: hidden;
    }
</style>