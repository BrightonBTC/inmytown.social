<script lang="ts">
    export let t:string | undefined = undefined;
</script>

{#if t}
<p class="text-center">{t}</p>
{/if}

<div class="text-center">
    <div class="spinner-border text-info"></div>
</div>