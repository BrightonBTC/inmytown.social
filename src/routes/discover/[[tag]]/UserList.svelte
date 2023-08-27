<script lang="ts">
    import type NDK from "@nostr-dev-kit/ndk";
    import { personList } from "./stores";
    import Loading from "$lib/Loading.svelte";
    import UserName from "$lib/user/UserName.svelte";
    import LinkedPfpIcon from "$lib/user/LinkedPFPIcon.svelte";
    import UserStatus from "./UserStatus.svelte";
    import { fetchUser } from "$lib/user/user";
    export let ndk: NDK;
</script>

{#each Object.values($personList) as statusData}
    <div class="mb-3 rounded">
        {#await fetchUser(ndk, statusData.author.npub)}
            <Loading />
        {:then user}
        <div class="card mb-3 p-2">
            <div class="d-flex">
                <div>
                    <LinkedPfpIcon {ndk} npub={statusData.author.npub} cls='lg' />
                </div>
                <div>
                    <div class="card-body">
                        <h4 class="card-title"><UserName {user} /></h4>
                        <UserStatus {statusData} />
                    </div>
                </div>
            </div>
        </div>
        {/await}
        
    </div>
{/each}