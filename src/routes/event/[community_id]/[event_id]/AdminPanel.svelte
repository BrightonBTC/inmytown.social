<script lang="ts">
    import { MeetupEvent, type EventMeta } from "$lib/event/event";
    export let data: EventMeta;

</script>
<div class="mt-2 bg-black p-1 mb-2 rounded">
    
    <a href="{MeetupEvent.url(data)}/edit" class="btn btn-success btn-sm m-1"
        >Edit event</a
    >
</div>