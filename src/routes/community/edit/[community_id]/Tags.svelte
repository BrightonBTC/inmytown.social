<script>
    import { community } from "./stores";
</script>

<span class="text-muted">Tags:</span>
{#each $community.meta.tags as t}
    <span class="badge rounded-pill bg-info me-1">#{t}</span>
{/each}
<i
    class="bi bi-pencil-fill text-primary"
    data-bs-toggle="modal"
    data-bs-target="#tagsModal"
/>
<style>
	i {
		font-size: 0.8rem;
		cursor: pointer;
	}
</style>