<script lang="ts">
    import { meetupStore } from "./stores";
</script>

<label for="im" class="form-label text-light">Image URL:</label>
<input
    type="im"
    class="form-control"
    id="im"
    placeholder="eg. http://images.com/myimage.webp"
    name="im"
    bind:value={$meetupStore.meta.image} 
/>