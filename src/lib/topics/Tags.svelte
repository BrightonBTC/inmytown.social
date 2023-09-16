<script lang="ts">
    import Tag from "./Tag.svelte";
    import LinkedTag from "./LinkedTag.svelte";
    export let tags: string[] | undefined;
    export let linked: boolean;
</script>
<div class="d-flex align-items-center">
    <i class="bi bi-tag me-2 text-primary" />
    <div>
        {#if tags}
        {#each tags as tag}
            {#if linked}
                <LinkedTag {tag} />
            {:else}
                <Tag {tag} />
            {/if}
        {/each}
    {/if}
    </div>
</div>
