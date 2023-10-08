<script lang="ts">
    import AdminPanel from "$lib/user/AdminPanel.svelte";
    export let community_id: string;
</script>
<AdminPanel>
    <a href="/events/{community_id}" class="btn btn-success btn-sm m-1"
        >Manage events</a
    >
    <a href="/community/edit/{community_id}" class="btn btn-success btn-sm m-1"
        >Edit community</a
    >
</AdminPanel>
