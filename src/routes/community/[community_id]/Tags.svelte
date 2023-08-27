<script lang="ts">

    export let tags: string[];

</script>

<div class="p-2 mb-4">
    {#each tags as t}
        <span class="badge rounded-pill bg-info me-1">#{t}</span>
    {/each}
</div>
