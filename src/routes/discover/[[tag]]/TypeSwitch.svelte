<script>

    import { searchType } from "./stores";

</script>
<div class="p-2">
    {#each ['communities', 'events', 'people'] as t}
    <div class="form-check">
        <input
            type="radio"
            class="form-check-input"
            id={t}
            name="searchType"
            value={t}
            bind:group={$searchType}
        />
        <label class="form-check-label" for={t}>
            <span>{t}</span>
        </label>
    </div>
    {/each}
</div>
