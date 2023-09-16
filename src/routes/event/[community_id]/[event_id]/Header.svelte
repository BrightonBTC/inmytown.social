<script>
    import { imgUrlOrDefault } from "$lib/helpers";
    import { meetupStore } from "./stores";
</script>

<img
    src={imgUrlOrDefault($meetupStore.meta.image, 'event')}
    alt={$meetupStore.meta.title}
    class="img-fluid rounded e-im"
/>
<style>
    .e-im {
        object-fit: cover;
        width: 100%;
    }
</style>