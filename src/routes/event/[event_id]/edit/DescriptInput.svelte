<script lang="ts">
    import { marked } from "marked";
    import { eventMetaStore } from "./stores";
</script>


<label for="descr" class="form-label text-light">Event description:</label>
<div class="container-fluid">
    <div class="row bg-secondary border p-2 rounded">
        <div class="col-sm-6">
            <p class="text-muted">Markdown:</p>
            <textarea
                rows="12"
                class="form-control"
                id="descript"
                placeholder="Give some details about your event. eg. who is it for? what's the address? where can tickets be purchased?"
                name="descript"
                bind:value={$eventMetaStore.content}
            />
        </div>
        <div class="col-sm-6 text-light">
            <p class="text-muted">Result:</p>
            {@html marked($eventMetaStore.content)}
        </div>
    </div>
</div>