<script lang="ts">
    import { onMount } from "svelte";
    import Loading from "$lib/Loading.svelte";
    import { userNpub, userProfile } from "$lib/stores/persistent";
    import type NDK from "@nostr-dev-kit/ndk";
    import type { NDKUser } from "@nostr-dev-kit/ndk";
    import { imgUrlOrDefault } from "$lib/helpers";
    import UserName from "./UserName.svelte";
    import { fetchUser } from "./user";

    export let ndk: NDK | undefined;
    export let npub: string | undefined;
    let user: NDKUser | undefined;

    $: setUser(), npub

    async function setUser(){
        if(ndk && npub) user = await fetchUser(ndk, npub);
    }
</script>
{#if user?.profile && npub}
<div class="card shadow">
    <a href="/user/{npub}">
        <img class="card-img-top" src={imgUrlOrDefault(user.profile.image)} alt="{user.profile.name} photo" />
    </a>
    <div class="card-body">
        <p class="card-title"><span class="userName"><UserName {user} /></span></p>
        <p class="card-text">{user.profile.about}</p>
    </div>
</div>
{:else}
<Loading />
{/if}
<style>
    .userName{
        white-space: nowrap;
        text-overflow: ellipsis;
        display: block;
        overflow: hidden;
    }
</style>