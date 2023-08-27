<script lang="ts">
import { DateInput } from 'date-picker-svelte'
import { eventMetaStore } from './stores';
let today = new Date()
today.setHours(0,0,0,0);
let startH: number = 0;
let startM: number = 0;
let endH: number = 0;
let endM: number = 0;

let starts = new Date()
if($eventMetaStore.starts > 0){
    starts.setTime($eventMetaStore.starts * 1000)
    startH = starts.getHours()
    startM = starts.getMinutes()
}
starts.setHours(0,0,0,0);

let ends = new Date()
if($eventMetaStore.ends > 0){
    ends.setTime($eventMetaStore.ends * 1000)
    endH = ends.getHours()
    endM = ends.getMinutes()
}
ends.setHours(0,0,0,0);



$: updateStart(), starts, startH, startM
$: updateEnd(), ends, endH, endM

function updateStart(){
    console.log('updateStart')
    $eventMetaStore.starts = (starts.getTime()/1000) + (startH * 60 *60 ) + (startM * 60 )
    $eventMetaStore = $eventMetaStore
}
function updateEnd(){
    console.log('updateEnd')
    $eventMetaStore.ends = (ends.getTime()/1000) + (endH * 60 *60 ) + (endM * 60 )
    $eventMetaStore = $eventMetaStore
}
</script>
<div class="row">
    <div class="d-flex flex-row align-items-center m-1">
        <label for="name" class="form-label text-light">starts: </label>
        <DateInput format='yyyy-MM-dd' min={today} bind:value={starts} /> 
        <select class="form-select w-auto pt-1 pb-1 ms-2" bind:value={startH}>
            {#each Array(24) as _, row}
            <option value={row}>{(row).toString().padStart(2, '0')}</option>
            {/each}
        </select>:
        <select class="form-select w-auto pt-1 pb-1" bind:value={startM}>
            {#each Array(12) as _, row}
            <option value={row*5}>{(row*5).toString().padStart(2, '0')}</option>
            {/each}
        </select>
    </div>
    <div class="d-flex flex-row align-items-center m-1">
        <label for="name" class="form-label text-light">ends: </label>
        <DateInput format='yyyy-MM-dd' min={starts} bind:value={ends} />
        <select class="form-select w-auto pt-1 pb-1 ms-2"  bind:value={endH}>
            {#each Array(24) as _, row}
            <option value={row}>{(row).toString().padStart(2, '0')}</option>
            {/each}
        </select>:
        <select class="form-select w-auto pt-1 pb-1" bind:value={endM}>
            {#each Array(12) as _, row}
            <option value={row*5}>{(row*5).toString().padStart(2, '0')}</option>
            {/each}
        </select>
    </div>
</div>
<style>
    .form-label{
        width: 6em;
    }
</style>
