<script lang="ts">
    import { community } from "./stores";

</script>

<label for="name" class="form-label text-muted">Community banner image:</label>
<input
    type="img"
    class="form-control"
    id="img"
    placeholder="eg. https://i.ibb.co/my-img.jpg"
    name="img"
    bind:value={$community.meta.image}
/>