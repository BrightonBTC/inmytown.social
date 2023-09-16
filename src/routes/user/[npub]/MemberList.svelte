<script lang="ts">
    import MemberItem from "./MemberItem.svelte";
    import { meetupUser } from "./stores";
</script>

<h3>Member of:</h3>
{#if $meetupUser.status}
    <ul class="list-group">
        {#each $meetupUser.status?.communities as id}
            <MemberItem {id} />
        {/each}
    </ul>
{/if}
