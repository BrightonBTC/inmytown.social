<script lang="ts">

    import { dateStringFull } from "$lib/formatDates";
    export let ends:number
    export let starts:number

    let now = (Date.now()/1000)

</script>
{#if ends < now}
    <div class="alert alert-warning">
        <strong>Ended! </strong>This event ended on {dateStringFull(ends)}
    </div>
{:else if starts < (Date.now()/1000) }
    <div class="alert alert-success text-white">
        <strong>Happening now! </strong>This event started at {dateStringFull(starts)}
    </div>
{/if}