<script lang="ts">
    import { onMount } from "svelte";
    import MemberItem from "./MemberItem.svelte";
    import { meetupUser } from "./stores";

    let ready = false
    onMount(async () => {
        await $meetupUser.fetchStatus()
        ready = true
    })
</script>

<h3>Member of:</h3>
{#if ready && $meetupUser.status}
    <ul class="list-group">
        {#each $meetupUser.status?.communities as id}
            <MemberItem {id} />
        {/each}
    </ul>
{/if}
