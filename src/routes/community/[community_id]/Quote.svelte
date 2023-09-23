<script lang="ts">
    import type { NDKEvent } from "@nostr-dev-kit/ndk";
    import { chatCommentsStore } from "./stores/store.chat";
    import PfpIcon from "$lib/user/PFPIcon.svelte";

    export let id: string;
    let comment: NDKEvent;

    $: setQuote(), id

    async function setQuote(){
        comment = $chatCommentsStore.filter((e) => e.id === id)[0]
    }
</script>
{#if comment}
<a href="#{comment.id}" class="bg-dark p-2 rounded mb-3 quote text-decoration-none d-flex">
    <PfpIcon npub={comment.author.npub} cls='tiny' /> 
    <small class="text-muted ps-1 flex-grow-1">{comment.content}</small>
</a>
{/if}
