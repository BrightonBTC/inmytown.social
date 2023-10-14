<script lang="ts">
    import { MeetupEvent, type EventMeta } from "$lib/event/event";
    import AdminPanel from "$lib/user/AdminPanel.svelte";
    export let data: EventMeta;

</script>
<AdminPanel>
    <a href="{MeetupEvent.url(data)}/edit" class="btn btn-success btn-sm m-1"
        >Edit event</a
    >
</AdminPanel>