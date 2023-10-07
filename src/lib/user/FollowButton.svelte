<script lang="ts">
    import { loggedInUser } from "$lib/stores/user";
    import type { MeetupUser } from "./user";

    export let user:MeetupUser

    let amFollowing: boolean = false;
    let followsList: string[] | undefined = undefined;

    $: checkFollowing(), user


    async function checkFollowing() {
        let f = await $loggedInUser?.follows()
        if(f) followsList = [...f].map(item => item.npub)
        if(followsList?.includes(user.npub)){
            amFollowing = true
        }
    }

    async function follow(){
        if($loggedInUser){
            let follow = await $loggedInUser.follow(user)
            if(follow) amFollowing = true
        }
    }
    async function unfollow(){
        if($loggedInUser){
            let unfollow = await $loggedInUser.unfollow(user)
            if(unfollow) amFollowing = false
        }
    }

</script>
{#if amFollowing}
    <button
        class="btn position-absolute btn-success end-0 me-3 mt-3 shadow"
        on:click={unfollow}
        ><i class="bi bi-person-check-fill" /> following</button
    >
{:else}
    <button
        class="btn position-absolute btn-primary end-0 me-3 mt-3 border-dark shadow"
        title="Follow now"
        on:click={follow}
        ><i class="bi bi-person-fill-add" /></button
    >
{/if}
<style>
    .bi-person-fill-add{
        font-size: 2em;
    }
</style>