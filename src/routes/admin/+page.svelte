<script lang="ts">
    import { onMount } from "svelte";
    import { userNpub } from "$lib/stores";
    import { goto } from "$app/navigation";
    import { login } from "$lib/user/user";
    import ndk from "$lib/ndk";

    onMount(async () => {

        await login(ndk)
        if($userNpub){
            goto("/user/"+$userNpub);
        }
    });
</script>


