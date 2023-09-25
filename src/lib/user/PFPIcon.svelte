<script lang="ts">
    import { imgUrlOrDefault } from "$lib/helpers";
    import type { NDKUser } from "@nostr-dev-kit/ndk";
    import { fetchUser } from "./user";
    import { loggedInUser } from "$lib/stores/user";

    import ndk from "$lib/ndk";

    export let npub: string | undefined;
    export let cls: string = ''; 
    let user: NDKUser | undefined;

    $: setUser(), npub
    async function setUser(){
        if(npub){
            user = await fetchUser($ndk, npub);
            if(npub === $loggedInUser?.npub) cls += ' border-success border-3'
        } 
    }
</script>
{#if user?.profile && npub}
    <img
        src="{imgUrlOrDefault(user.profile.image, 'user')}"
        alt="{user.profile.name}"
        class="uim rounded-circle mx-auto {cls} shadow-sm border"
        data-bs-toggle="toggle"
        title={user.profile.displayName}
    />
{/if}
<style>
    .uim {
        width: 50px;
        height: 50px;
        object-fit: cover;
    }
    .uim.tiny {
        width: 20px;
        height: 20px;
    }
    .uim.sm {
        width: 35px;
        height: 35px;
    }
    .uim.lg {
        width: 150px;
        height: 150px;
    }
</style>