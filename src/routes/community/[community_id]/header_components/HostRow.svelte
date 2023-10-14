<script>
    import LoadingMini from "$lib/LoadingMini.svelte";
import LinkedPfpIcon from "$lib/user/LinkedPFPIcon.svelte";
    import UserName from "$lib/user/UserName.svelte";
    import { host } from "../stores/store.community";

</script>

<li class="list-group-item">
    <i class="bi bi-person me-2 text-primary"></i> 
    {#if $host}
    <span>Hosted by</span>
    <span><UserName user={$host} /> <LinkedPfpIcon cls="tiny" npub={$host.npub} /> </span> 
    {:else}
    <LoadingMini />
    {/if}
</li>
<style>
    i{
        font-size:1.2rem;
    }
</style>