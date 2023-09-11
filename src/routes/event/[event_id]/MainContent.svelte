<script>

    import { dateStringFull } from "$lib/formatDates";
    import { marked } from "marked";
    import { meetupStore } from "./stores";

</script>
<p class="lead mt-2">
    <span class="badge bg-dark mb-1 text-light border"
        ><i class="bi bi-clock pe-2 text-primary" />
        {dateStringFull($meetupStore.meta.starts)}</span
    >
</p>

<div class="p-5 border-end">
    {@html marked($meetupStore.meta.content)}
</div>