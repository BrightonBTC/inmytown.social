<script lang="ts">
    import { meetupStore } from "./stores";
</script>

<label for="name" class="form-label text-light">Event title:</label>
<input
    type="name"
    class="form-control"
    id="name"
    placeholder="eg. My local meetup"
    name="name"
    maxlength="100"
    bind:value={$meetupStore.meta.title} 
/>