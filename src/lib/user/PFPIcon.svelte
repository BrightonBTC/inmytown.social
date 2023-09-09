<script lang="ts">
    import { imgUrlOrDefault } from "$lib/helpers";
    import type { NDKUser } from "@nostr-dev-kit/ndk";
    import type NDK from "@nostr-dev-kit/ndk";
    import { fetchUser } from "./user";
    import { userNpub } from "$lib/stores";

    export let ndk: NDK | undefined;
    export let npub: string | undefined;
    export let cls: string = ''; 
    let user: NDKUser | undefined;

    $: setUser(), npub
    async function setUser(){
        if(ndk && npub){
            user = await fetchUser(ndk, npub);
            if(npub === $userNpub) cls += ' border-success border-3'
        } 
    }
</script>
{#if user?.profile && npub}
    <img
        src="{imgUrlOrDefault(user.profile.image)}"
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