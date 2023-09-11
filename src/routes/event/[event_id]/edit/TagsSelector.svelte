<script lang="ts">
    import "bootstrap-icons/font/bootstrap-icons.css";
    import { meetupStore } from "./stores";

    let disabled: boolean = false;

    function submitTag(e: any){
        if(e.key === 'Enter') addTag()
    }

    const addTag = () => {
        if(parsed.length > 1){
            if(!$meetupStore.meta.tags.includes(parsed)){
                $meetupStore.meta.tags = [...$meetupStore.meta.tags, parsed];
            }
            //$eventMetaStore = $eventMetaStore
            parsed = '';
            checkNTags();
        }
    };
    const deleteTag = (s: string) => {
        $meetupStore.meta.tags = $meetupStore.meta.tags.filter((t) => t !== s)
        //$eventMetaStore = $eventMetaStore
        checkNTags();
    };
    const checkNTags = () => {
        disabled = $meetupStore.meta.tags.length > 9;
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
            <div class="modal-header">
                <h4 class="modal-title text-muted">Add up to 10 tags</h4>
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                />
            </div>

            <div class="modal-body">
                <input id="communityTags" bind:value={parsed}  on:input={onChange} on:keyup={submitTag} disabled={disabled} />
                <small class="text-muted">{$meetupStore.meta.tags.length} of 10 tags added</small>
                {#each $meetupStore.meta.tags as t}
                    <span class="badge rounded-pill bg-info m-1">#{t} <a href='#top' on:click|preventDefault={() => deleteTag(t)}><i class="bi bi-x-circle text-dark"></i></a></span>
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