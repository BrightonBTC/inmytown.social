<script lang="ts">

    export let community_id: string;

</script>
<div class="mt-2 bg-dark p-1 mb-2 rounded">
    <a href="/events/{community_id}" class="btn btn-success btn-sm m-1"
        >Manage events</a
    >
    <a href="/community/edit/{community_id}" class="btn btn-success btn-sm m-1"
        >Edit community</a
    >
</div>