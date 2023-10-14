<script lang="ts">
    import { chatFilter } from "../stores/store.chat";
    let selected:number;
</script>
<select class="form-select w-auto" bind:value={selected} on:change={() => chatFilter.set(selected)}>
    <option value=1>approved members only</option>
    <option value=2>approved members + pending approval</option>
    <option value=3>everyone</option>
</select>