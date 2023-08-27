<script lang="ts">
    import { communityMetaStore } from "./stores";
    import "bootstrap-icons/font/bootstrap-icons.css";

    let disabled: boolean = false;

    const addTag = () => {
        if(parsed.length > 1){
            if(!$communityMetaStore.tags.includes(parsed)){
                $communityMetaStore.tags = [...$communityMetaStore.tags, parsed];
            }
            $communityMetaStore = $communityMetaStore
            parsed = '';
            checkNTags();
        }
    };
    const deleteTag = (s: string) => {
        $communityMetaStore.tags = $communityMetaStore.tags.filter((t) => t !== s)
        $communityMetaStore = $communityMetaStore
        checkNTags();
    };
    const checkNTags = () => {
        disabled = $communityMetaStore.tags.length > 9;
    }

    function parse(tag: string){
        return tag.replace(/[^A-Za-z0-9\-]/g, '').toLowerCase();
    }

    let tag: string = '';
    let parsed: string = parse(tag);

    const onChange = () => {
        parsed = parse(parsed);
    };
</script>

<div class="modal" id="tagsModal">
    <div class="modal-dialog  modal-dialog-centered">
        <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
                <h4 class="modal-title">Add up to 10 tags</h4>
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                />
            </div>

            <!-- Modal body -->
            <div class="modal-body">
                <form on:submit|preventDefault={addTag}>
                    <input id="communityTags" bind:value={parsed}  on:input={onChange} disabled={disabled} />
                    <small>{$communityMetaStore.tags.length} of 10 tags added</small>
                </form>
                {#each $communityMetaStore.tags as t}
                <span class="badge rounded-pill bg-info m-1">#{t} <a href='#top' on:click|preventDefault={() => deleteTag(t)}><i class="bi bi-x-circle"></i></a></span>
                {/each}
            </div>

        </div>
    </div>
</div>



<style>
    i{
        font-size:1rem;
        cursor: pointer;
    }
</style>