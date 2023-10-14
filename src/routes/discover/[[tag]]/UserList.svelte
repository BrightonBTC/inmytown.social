<script lang="ts">
    import { personList } from "./stores";
    import Loading from "$lib/Loading.svelte";
    import UserName from "$lib/user/UserName.svelte";
    import LinkedPfpIcon from "$lib/user/LinkedPFPIcon.svelte";
    import UserStatus from "./UserStatus.svelte";
    import { fetchUser } from "$lib/user/user";
    import ndk from "$lib/stores/ndk";
</script>

{#each Object.values($personList) as statusData}
    <div class="mb-3">
        {#await fetchUser($ndk, statusData.author.npub)}
            <Loading />
        {:then user}
        <div class="card mb-3 p-2 bg-secondary border-0 shadow">
            <div class="d-flex align-items-center">
                <div class="p-4">
                    <LinkedPfpIcon npub={statusData.author.npub} cls='lg' />
                </div>
                <div class="flex-grow-1">
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