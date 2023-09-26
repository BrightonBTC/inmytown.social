<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { login } from "$lib/user/user";
    import ndk from "$lib/stores/ndk";
    import { loggedInUser } from "$lib/stores/user";

    onMount(async () => {

        await login($ndk)
        if($loggedInUser){
            goto("/user/"+$loggedInUser.npub);
        }
    });
</script>


