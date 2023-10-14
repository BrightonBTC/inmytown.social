<script lang="ts">
    import Loading from "$lib/Loading.svelte";


    import UserRow from "./UserRow.svelte";

    export let users:string[] | undefined
    export let accessLevel:userAccessLevel

</script>

{#if users}
    {#if users.length < 1}
        <div class="alert alert-info small m-2 p-1">no new requests</div>
    {/if}
    {#each users as npub}
        <UserRow {npub} accessLevel={accessLevel} />
    {/each}
{:else}
    <Loading />
{/if}