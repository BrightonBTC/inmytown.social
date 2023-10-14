<script lang="ts">
    import Loading from "$lib/Loading.svelte";
    import type { NDKUser } from "@nostr-dev-kit/ndk";
    import UserName from "$lib/user/UserName.svelte";
    import { fetchUser } from "$lib/user/user";
    import LinkedPfpIcon from "$lib/user/LinkedPFPIcon.svelte";
    import ndk from "$lib/stores/ndk";
    import { community } from "./stores";

    export let npub: string;
    export let accessLevel: userAccessLevel;
    let user: NDKUser | undefined;

    $: npub, setUser();
    async function setUser() {
        user = undefined;
        user = await fetchUser($ndk, npub);
    }

    async function updateStatus(status:userAccessActions) {
        switch (status){
            case 'accept':
                $community.approveMember(npub)
                break

            case 'clear':
                $community.removeMember(npub)
                break

            case 'block':
                $community.blockUser(npub)
                break

            case 'unblock':
                $community.unblockUser(npub)
                break
        }
        $community = $community
    }
</script>

<div class="card mb-2 user-{npub}">
    {#if user}
        <div class="d-flex card-body p-2 align-items-center" style="gap:15px">
            <div>
                <LinkedPfpIcon npub={user.npub} />
            </div>
            <div>
                <h5 class="card-title mb-0 me-auto"><UserName {user} /></h5>
            </div>

            {#if accessLevel === "accepted"}
                <button
                    class="btn btn-secondary ms-auto"
                    on:click={() => updateStatus('clear')}
                    >remove</button
                >
            {:else if accessLevel === "pending"}
                <button
                    class="btn btn-success ms-auto"
                    on:click={() => updateStatus('accept')}
                    >approve</button
                >
            {/if}

            {#if accessLevel === "rejected"}
                <button
                    class="btn"
                    on:click={() => updateStatus('unblock')}
                    >unblock</button
                >
            {:else}
                <button
                    class="btn btn-danger"
                    on:click={() => updateStatus('block')}>mute</button
                >
            {/if}
        </div>
    {:else}
        <Loading />
    {/if}
</div>

<style>
    .loc {
        margin-left: auto;
    }
    button {
        opacity: 0;
        transition: 0.6s;
    }
    .card:hover button {
        opacity: 0.9;
    }
</style>
