<script lang="ts">
    import { meetupStore } from "./stores";
</script>

<label for="brief" class="form-label text-light">Brief description</label>
<textarea
    rows="3"
    class="form-control"
    id="brief"
    placeholder="Provide a short description"
    name="brief"
    maxlength="300"
    bind:value={$meetupStore.meta.brief}
/>
