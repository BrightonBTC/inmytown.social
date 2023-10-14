<script lang="ts">
    import { imgUrlOrDefault } from "$lib/helpers";
    import type { NDKUser } from "@nostr-dev-kit/ndk";
    import { fetchUser } from "./user";
    //import { loggedInUser } from "$lib/stores/user";

    import ndk from "$lib/stores/ndk";

    export let npub: string | undefined;
    export let cls: string = ''; 
    let user: NDKUser | undefined;

    $: setUser(), npub
    async function setUser(){
        if(npub){
            user = await fetchUser($ndk, npub);
            //if(npub === $loggedInUser?.npub) cls += ' border-success border-3'
        } 
    }
</script>
{#if user?.profile && npub}
    <img
        src="{imgUrlOrDefault(user.profile.image, 'user')}"
        alt="{user.profile.name}"
        class="uim rounded-circle mx-auto shadow-sm border {cls}"
        data-bs-toggle="toggle"
        title={user.profile.displayName}
    />
{/if}
<style>
    .uim {
        width: 50px;
        height: 50px;
        object-fit: cover;
        clip-path: circle(45%);
        transition: all .3s ease;
        border: 2.5px solid var(--bs-primary) !important;
    }
    .uim:hover{
        clip-path: circle(50%);
    }
    .uim.tiny {
        width: 20px;
        height: 20px;
        border-width: 1px !important;
    }
    .uim.sm {
        width: 40px;
        height: 40px;
        border-width: 2px !important;
    }
    .uim.md {
        width: 110px;
        height: 110px;
        border-width: 4px !important;
    }
    .uim.lg {
        width: 150px;
        height: 150px;
        border-width: 5px !important;
    }
</style>