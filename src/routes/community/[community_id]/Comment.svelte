<script lang="ts">
    import { dateStringFull } from "$lib/formatDates";
    import LinkedPfpIcon from "$lib/user/LinkedPFPIcon.svelte";
    import UserName from "$lib/user/UserName.svelte";
    import { fetchUser } from "$lib/user/user";
    import type NDK from "@nostr-dev-kit/ndk";
    import type { NDKEvent, NDKTag, NDKUser } from "@nostr-dev-kit/ndk";
    import Quote from "./Quote.svelte";

    export let ndk: NDK;
    export let comment: NDKEvent;

    let ts = '';
    let user: NDKUser | undefined;
    let replyTo: string | undefined;

    $: setComment(), comment
    async function setComment(){
        ts = comment.created_at ? dateStringFull(comment.created_at): '';
        if(ndk && comment.author) user = await fetchUser(ndk, comment.author.npub);
        let etags = comment.tags.filter((t) => t[0] === 'e' && t[3] === 'reply')
        if(etags.length > 0) replyTo = etags[0][1]
        else replyTo = undefined
    }

    export let callback = (id:string) => {};

    
    
</script>

<p class="text-muted mt-4 mb-0 text-end pe-4" id="{comment.id}"><small>{ts}</small></p>
<div class="container-fluid">
    <div class="d-flex align-items-center">
        <div class="ps-2 pe-2 user-section text-center">
            <LinkedPfpIcon {ndk} npub={comment.author.npub} cls='sm' />
            <small class="mt-2 overflow-e"><UserName {user} /></small>
        </div>
        <div class="flex-grow-1 bubble-wrap">
            <div class="speech-bubble p-4 rounded-4 ">
                {#if replyTo}
                    <Quote {ndk} id={replyTo} />
                {/if}
                <!-- {#if respondingTo != ""}
                    <div class="bg-light p-1 rounded mb-1">
                        <small class="text-muted">Responding to Carlito:</small>
                        <small>{respondingTo}</small>
                    </div>
                {/if} -->
                <div class="text-light">{comment.content}</div>
                <button
                    class="btn btn-dark d-flex align-items-center float-end clearfix border small"
                    data-bs-toggle="modal"
                    data-bs-target="#commentModal"
                    on:click={() => callback(comment.id)}
                 ><span class="small">Reply</span><i class="bi bi-chat-text ps-2" />
                </button>
            </div>
        </div>
    </div>
</div>

<style>
    .overflow-e{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 70px;
    }
    .user-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-wrap: nowrap;
    }

    .speech-bubble {
        position: relative;
        background: rgba(var(--bs-tertiary-rgb));
    }
    .speech-bubble::after {
        content: "";
        border: 10px solid transparent;
        position: absolute;
        border-right-color: rgba(var(--bs-tertiary-rgb));
        border-left: 0;
        left: -10px;
        top: 50%;
        margin-top: -10px;
    }

    .bubble-wrap {
        padding-left: 10px;
    }
</style>
