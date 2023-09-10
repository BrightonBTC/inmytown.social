<script>
    import { community } from "./stores";
</script>

{#if $community.meta.error}
    <div class="mb-3 mt-3">
        <span class="alert alert-warning">{$community.meta.error}</span>
    </div>
{/if}
