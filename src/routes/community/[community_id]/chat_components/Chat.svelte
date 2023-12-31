<script lang="ts">
    import Comment from "./Comment.svelte";
    import { NDKEvent, NDKSubscription, NDKUser, type NDKFilter } from "@nostr-dev-kit/ndk";
    import { community } from "../stores/store.community";
    import { relays } from "$lib/stores/persistent";
    import Quote from "./Quote.svelte";
    import ndk from "$lib/stores/ndk";
    import {
        addComment,
        chatCommentsStore,
        chatFilter,
        chatStore,
        sortedComments,
    } from "../stores/store.chat";
    import { onDestroy } from "svelte";
    import FilterSelect from "./FilterSelect.svelte";

    let chommentsSub: NDKSubscription;

    $: getChat(), $community.meta;
    $: getComments(), $chatFilter;

    function getChat() {
        chatStore.set(undefined);

        const chatSub = $ndk.subscribe({
            kinds: [40],
            "#e": [$community.meta.eid],
            authors: [$community.meta.authorhex],
        });
        chatSub.on("event", (event: NDKEvent) => {
            chatStore.set(event.id);
            getComments();
        });
    }
    getChat();

    function getComments() {
        chatCommentsStore.set([]);
        let authors: string[] | undefined = undefined;

        if ($chatFilter == 1) {
            if ($community.users.members && $community.users.stale) {
                authors = [];
                let j = [...$community.users.members, ...$community.users.stale];
                j.forEach((n) => {
                    let u = new NDKUser({ npub: n });
                    authors?.push(u.hexpubkey());
                });
            }
        } else if ($chatFilter == 2) {
            if ($community.users.members && $community.users.stale && $community.users.followers) {
                authors = [];
                let j = [
                    ...$community.users.members,
                    ...$community.users.stale,
                    ...$community.users.followers,
                ];
                j.forEach((n) => {
                    let u = new NDKUser({ npub: n });
                    authors?.push(u.hexpubkey());
                });
            }
        }

        if ($chatStore) {
            let filter: NDKFilter = {
                kinds: [42],
                "#e": [$chatStore],
            };
            if (authors) filter.authors = authors;
            chommentsSub = $ndk.subscribe(filter, { closeOnEose: false });
            chommentsSub.on("event", (event: NDKEvent) => {
                addComment(event);
            });
        }
    }

    let respondingTo: string | null = null;
    let commentText: string;

    async function postComment() {
        if (!commentText || commentText.length < 1 || !$chatStore) return;
        if (!relays || relays.length < 1) return;
        const event = new NDKEvent($ndk);
        event.kind = 42;
        event.content = commentText;
        event.tags.push(["e", $chatStore, relays[0], "root"]);
        if (respondingTo) {
            event.tags.push(["e", respondingTo, relays[0], "reply"]);
        }
        await event.publish();
        commentText = "";
    }

    function setRespondingTo(id: string | null) {
        respondingTo = id;
    }
    onDestroy(() => {
        chommentsSub.stop();
    });
</script>

<div class="p-2 mt-3">
    {#if $chatStore}
        <div class="text-center">
            <button
                class="btn btn-dark d-flex align-items-center mx-auto mb-4"
                data-bs-toggle="modal"
                data-bs-target="#commentModal"
                on:click|preventDefault={() => setRespondingTo(null)}
                ><span>New comment</span><i class="bi bi-chat-text ps-2" />
            </button>
        </div>
        <p class="d-flex justify-content-center align-items-center small">
            <span class="me-1">Show comments from:</span>
            <FilterSelect />
        </p>
        {#each $sortedComments as comment}
            <Comment {comment} callback={setRespondingTo} />
        {/each}
    {/if}
</div>
<div class="modal" id="commentModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">What's on your mind?</h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" />
            </div>

            <div class="modal-body">
                {#if respondingTo}
                    <Quote id={respondingTo} />
                {/if}
                <textarea
                    class="form-control"
                    rows="5"
                    maxlength="500"
                    id="comment"
                    name="text"
                    bind:value={commentText} />
            </div>

            <div class="modal-footer">
                <button
                    type="button"
                    class="btn btn-success"
                    data-bs-dismiss="modal"
                    on:click|preventDefault={postComment}>Post</button>
            </div>
        </div>
    </div>
</div>

<style>
    .bi-chat-text {
        font-size: 2rem;
    }
</style>
