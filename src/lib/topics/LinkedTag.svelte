<script lang="ts">
    import Tag from "./Tag.svelte";
    export let tag: string;
</script>
<a class="text-decoration-none" href="/discover/{tag}"><Tag {tag} /></a>