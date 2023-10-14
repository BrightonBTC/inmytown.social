<script lang="ts">
    export let status: string | undefined;
</script>
{#if status}
<i class="bi bi-quote"></i>{status}<i class="bi bi-quote rot180"></i>
{/if}
<style>
    i{
        font-size: .8rem;
    }
    i::before{
        transform: translateY(-.3rem);
    }
    i.rot180::before{
        transform: rotate(180deg) translateY(.3rem);
    }
</style>