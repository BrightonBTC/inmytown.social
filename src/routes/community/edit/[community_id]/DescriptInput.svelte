<script lang="ts">
    import { marked } from "marked";
    import { communityMetaStore } from "./stores";
</script>

<label for="descr" class="form-label text-muted">Community description:</label>
<div class="container-fluid">
    <div class="row bg-secondary border p-2 rounded">
        <div class="col-sm-6">
            <p>Markdown:</p>
            <textarea
                rows="12"
                class="form-control"
                id="descript"
                placeholder="Give some details about your community. Markdown can be used here."
                name="descript"
                bind:value={$communityMetaStore.content}
            />
        </div>
        <div class="col-sm-6">
            <p>Result:</p>
            {@html marked($communityMetaStore.content)} 
        </div>
    </div>
</div>
