<script lang="ts">
    import { onMount } from "svelte";
    import "bootstrap-icons/font/bootstrap-icons.css";
    import type NDK from "@nostr-dev-kit/ndk";
    import { userNpub } from "$lib/stores";
    import { loadNDK } from "$lib/nostr";
    import { goto } from "$app/navigation";
    import { login } from "$lib/user/user";

    let ndk: NDK | undefined;

    onMount(async () => {
        ndk = await loadNDK();

        if (ndk) {
            await login(ndk)
            if($userNpub){
                goto("/user/"+$userNpub);
            }
        }
    });
</script>


