<script lang="ts">
    import { onMount } from "svelte";

    let hasSigner: boolean = false;
    onMount(() => {
        if(window.nostr){
            hasSigner = true;
        }
    });
    

    function triggerSigner(){

    }
</script>
{#if hasSigner}
<a href="/admin"
    type="button"
    class="nav-link border border-secondary rounded"
>
    Login
</a>
{:else}
<button
    type="button"
    class="nav-link border border-secondary rounded"
    data-bs-toggle="modal"
    data-bs-target="#loginModal"
>
    Login
</button>
{/if}