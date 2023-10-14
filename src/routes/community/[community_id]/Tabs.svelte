<script lang="ts">
    import About from "./About.svelte";
    import Chat from "./chat_components/Chat.svelte";
    import Events from "./Events.svelte";
    import { membersFetched } from "./stores/store.community";
</script>
<ul class="nav nav-tabs mt-2" id="myTab" role="tablist">
    <li class="nav-item" role="presentation">
        <button
            class="nav-link active"
            id="about-tab"
            data-bs-toggle="tab"
            data-bs-target="#about"
            type="button"
            role="tab"
            aria-controls="about"
            aria-selected="true">About</button
        >
    </li>
    <li class="nav-item" role="presentation">
        <button
            class="nav-link"
            id="events-tab"
            data-bs-toggle="tab"
            data-bs-target="#events"
            type="button"
            role="tab"
            aria-controls="events"
            aria-selected="false">Events</button
        >
    </li>
    <li class="nav-item" role="presentation">
        <button
            class="nav-link"
            id="chat-tab"
            data-bs-toggle="tab"
            data-bs-target="#chat"
            type="button"
            role="tab"
            aria-controls="chat"
            aria-selected="false">Community Chat</button
        >
    </li>
</ul>
<div class="tab-content mb-5" id="myTabContent">
    <div
        class="tab-pane fade show active"
        id="about"
        role="tabpanel"
        aria-labelledby="about-tab"
    >
        <About />
    </div>
    <div
        class="tab-pane fade"
        id="events"
        role="tabpanel"
        aria-labelledby="events-tab"
    >
        <Events />
    </div>
    <div
        class="tab-pane fade"
        id="chat"
        role="tabpanel"
        aria-labelledby="chat-tab"
    >
        {#if $membersFetched}
        <Chat />
        {/if}
    </div>
</div>