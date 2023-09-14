<script lang="ts">
    import type { URLVars } from "./+page";


    export let data: URLVars;

</script>
<div class="mt-2 bg-black p-1 mb-2 rounded">
    
    <a href="/event/{data.community_id}/{data.event_id}/edit" class="btn btn-success btn-sm m-1"
        >Edit event</a
    >
</div>