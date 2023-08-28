<script lang="ts">
    import type NDK from "@nostr-dev-kit/ndk";
    import { addFollow, currentUserFollowsHexs, currentUserFollowsNpubs, currentUserFollows, removeFollow } from "./stores";
    import { NDKEvent, NDKUser } from "@nostr-dev-kit/ndk";

    export let npub: string;
    export let ndk: NDK;

    let amFollowing: boolean = false;

    $: checkFollowing(), npub, $currentUserFollows

    function checkFollowing(){
        if($currentUserFollowsNpubs.includes(npub)){
            amFollowing = true;
        }
        else{
            amFollowing = false;
        }
    } 

    async function follow(){
        let user = new NDKUser({npub: npub})
        addFollow(user)

        const ndkEvent = new NDKEvent(ndk);
		ndkEvent.kind = 3;
        $currentUserFollowsHexs.forEach(function(hex){
            ndkEvent.tags.push(["p", hex])
        })
		ndkEvent.publish()
    }
    async function unfollow(){
        removeFollow(npub)

        const ndkEvent = new NDKEvent(ndk);
		ndkEvent.kind = 3;
        $currentUserFollowsHexs.forEach(function(hex){
            ndkEvent.tags.push(["p", hex])
        })
		ndkEvent.publish()
    }

</script>
{#if amFollowing}
    <button
        class="btn position-absolute btn-success end-0 me-3 mt-3 border-light shadow"
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