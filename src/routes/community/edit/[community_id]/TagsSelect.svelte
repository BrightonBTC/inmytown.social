<script lang="ts">
    import { community } from "./stores";
    import "bootstrap-icons/font/bootstrap-icons.css";

    let disabled: boolean = false;

    const addTag = () => {
        if(parsed.length > 1){
            if(!$community.meta.tags.includes(parsed)){
                $community.meta.tags = [...$community.meta.tags, parsed];
            }
            parsed = '';
            checkNTags();
        }
    };
    const deleteTag = (s: string) => {
        $community.meta.tags = $community.meta.tags.filter((t) => t !== s)
        $community.meta = $community.meta
        checkNTags();
    };
    const checkNTags = () => {
        disabled = $community.meta.tags.length > 9;
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
                    <small>{$community.meta.tags.length} of 10 tags added</small>
                </form>
                {#each $community.meta.tags as t}
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