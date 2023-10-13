<script lang="ts">
    import "bootstrap-icons/font/bootstrap-icons.css";

    export let tags: string[] = [];
    let disabled: boolean = false;

    const addTag = () => {
        if (parsed.length > 1) {
            if (!tags.includes(parsed)) {
                tags = [...tags, parsed];
            }
            parsed = "";
            checkNTags();
        }
    };
    const deleteTag = (s: string) => {
        tags = tags.filter((t) => t !== s);
        checkNTags();
    };
    const checkNTags = () => {
        disabled = tags.length > 9;
    };

    function parse(tag: string) {
        return tag.replace(/[^A-Za-z0-9\-]/g, "").toLowerCase();
    }

    let tag: string = "";
    let parsed: string = parse(tag);

    const onChange = () => {
        parsed = parse(parsed);
    };

    function submitTags() {
        callback(tags);
    }

    export let callback = (tags: string[]) => {};
</script>

<i
    class="bi bi-pencil-fill text-primary"
    data-bs-toggle="modal"
    data-bs-target="#tagsModal"
/>
<div class="modal" id="tagsModal">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title text-muted">Add up to 10 tags</h4>
                <button
                    type="button"
                    class="btn-close text-dark"
                    data-bs-dismiss="modal"
                />
            </div>

            <div class="modal-body">
                <div class="d-flex align-items-center mb-2">
                    <div class="flex-fill">
                        <input
                            id="communityTags"
                            bind:value={parsed}
                            on:input={onChange}
                            class="form-control"
                        />
                    </div>
                    <div class="flex-fill">
                        <button on:click|preventDefault={addTag} class="btn">+</button>
                    </div>
                    <div class="flex-fill">
                        <small class="text-muted">{tags.length} of 10 allowed tags added</small>
                    </div>
                </div>
                
                
                {#each tags as t}
                    <span class="badge rounded-pill bg-info m-1"
                        >#{t}
                        <a
                            href="#top"
                            on:click|preventDefault={() => deleteTag(t)}
                            ><i class="bi bi-x-circle text-dark" /></a
                        ></span
                    >
                {/each}
            </div>
            <div class="modal-footer">
                <button
                    class="text-success bg-secondary rounded border-0"
                    data-bs-dismiss="modal"
                    on:click|preventDefault={submitTags}
                    ><i class="bi bi-check-lg" /></button
                >
            </div>
        </div>
    </div>
</div>

<style>
    .bi-x-circle {
        font-size: 1rem;
        cursor: pointer;
    }
    .bi-check-lg {
        font-size: 2rem;
    }
</style>
