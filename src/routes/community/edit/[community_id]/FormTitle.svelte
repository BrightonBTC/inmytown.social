<script lang="ts">
    import { community } from "./stores";
</script>

<label for="title" class="form-label text-muted">Community title:</label>
<input
    type="title"
    class="form-control"
    id="title"
    placeholder="eg. My local meetup"
    name="title"
    bind:value={$community.meta.title}
/>

