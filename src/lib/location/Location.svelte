<script lang="ts">
    export let city:string | undefined;
    export let country:string | undefined;
</script>
<i class="bi bi-geo-alt me-2 text-primary"></i>
{#if city}
{city}, 
{/if}
{#if country}
{country}
{/if}