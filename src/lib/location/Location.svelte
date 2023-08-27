<script lang="ts">
    export let city:string | undefined;
    export let country:string | undefined;
</script>
<i class="bi bi-geo-alt me-2 text-primary"></i>
{#if city && country}
{city}, {country}
{:else}
<em><small class="text-muted">-- no location selected --</small></em>
{/if}