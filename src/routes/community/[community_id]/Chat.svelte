<script lang="ts">
    import type NDK from "@nostr-dev-kit/ndk";
    import Comment from "./Comment.svelte";
    import { NDKEvent } from "@nostr-dev-kit/ndk";
    import {
        addComment,
        chatCommentsStore,
        chatStore,
        sortedComments,
    } from "./stores";
    import { relays } from "$lib/stores";
    import Quote from "./Quote.svelte";

    export let ndk: NDK;
    export let community: string;

    $: getChat(), community;
    $: getComments(), $chatStore;

    async function getChat() {
        chatStore.set(undefined);

        if (ndk) {
            const chatSub = ndk.subscribe(
                {
                    kinds: [40],
                    "#e": [community],
                },
                {
                    closeOnEose: true,
                }
            );
            chatSub.on("event", (event: NDKEvent) => {
                chatStore.set(event.id);
            });
        }
    }

    async function getComments() {
        chatCommentsStore.set([]);

        if (ndk && $chatStore) {
            const chatSub = ndk.subscribe(
                {
                    kinds: [42],
                    "#e": [$chatStore],
                },
                {
                    closeOnEose: false,
                }
            );
            chatSub.on("event", (event: NDKEvent) => {
                addComment(event);
            });
        }
    }

    let respondingTo: string | null = null;
    let commentText: string;

    async function postComment() {
        if (!commentText || commentText.length < 1 || !$chatStore) return;
        if (!relays || relays.length < 1) return;
        const ndkEvent = new NDKEvent(ndk);
        ndkEvent.kind = 42;
        ndkEvent.content = commentText;
        ndkEvent.tags.push(["e", $chatStore, relays[0], "root"]);
        if(respondingTo){
            ndkEvent.tags.push(["e", respondingTo, relays[0], "reply"]);
        }
        await ndkEvent.publish();
        commentText = "";
    }

    function setRespondingTo(id: string | null){
        respondingTo = id;
    }
</script>

<div class="p-2 mt-3">
    {#if $chatStore}
    <div class="text-center">
        <button
            class="btn btn-dark d-flex align-items-center mx-auto"
            data-bs-toggle="modal"
            data-bs-target="#commentModal"
            on:click|preventDefault={() => setRespondingTo(null)}
            ><span>New comment</span><i class="bi bi-chat-text ps-2" />
        </button>
    </div>
        
        <!-- <form on:submit|preventDefault={postComment}>
            <div class="mb-3">
                <label for="comment">What's on your mind?</label>
                <textarea
                    class="form-control"
                    rows="5"
                    maxlength="500"
                    id="comment"
                    name="text"
                    bind:value={commentText}
                />
            </div>
            <div class="clearfix">
                <button type="submit" class="btn btn-primary float-end"
                    >Submit</button
                >
            </div>
        </form> -->

        <h3 class="mt-3">Recent Comments:</h3>
        {#each $sortedComments as comment}
            <Comment {ndk} {comment} callback={setRespondingTo} />
        {/each}
    {/if}
</div>
<div class="modal" id="commentModal">
    <div class="modal-dialog">
      <div class="modal-content">
  
        <div class="modal-header">
          <h4 class="modal-title">What's on your mind?</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
  
        <div class="modal-body">
            {#if respondingTo}
                <Quote {ndk} id={respondingTo} />
            {/if}
            <textarea
                class="form-control"
                rows="5"
                maxlength="500"
                id="comment"
                name="text"
                bind:value={commentText}
            />
        </div>
  
        <div class="modal-footer">
          <button type="button" class="btn btn-success" data-bs-dismiss="modal" on:click|preventDefault={postComment}>Post</button>
        </div>
  
      </div>
    </div>
</div>

<style>
    .bi-chat-text {
        font-size: 2rem;
    }
</style>
