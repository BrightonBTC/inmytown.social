<script lang="ts">
    import { goto } from "$app/navigation";
    import Tag from "$lib/topics/Tag.svelte";
    import { addTopic, removeTopic, topics } from "./stores";
    
    function parse(tag: string){
        return tag.replace(/[^A-Za-z0-9\-,]/g, '').toLowerCase();
    }
    let tag: string = '';
    let parsed: string = parse(tag);

    const onChange = () => {
        parsed = parse(parsed);
    };

    const delTopic = (tag:string) => {
        removeTopic(tag)
        loadNewTopicList()
    }

    const addTopics = () => {
        let ts = parsed.split(',');
        ts.forEach(function(t){
            addTopic(t)
        })
        loadNewTopicList()
    };

    function loadNewTopicList(){
        tag = '';
        parsed = '';
        goto('/discover/'+$topics.join(','))
    }
</script>

<div class="bg-secondary p-2 rounded border">
    <h5>Topics</h5>
    <small class="text-muted"><em>* you can enter a comma seperated list of topics below:</em></small>
    <form class="d-flex align-content-center mb-4" on:submit|preventDefault={addTopics}>
        <input type="text" bind:value={parsed}  on:input={onChange} class="form-control" name="tag" /><button type="submit" class="btn btn-primary">+</button>
    </form>
    <ul class="list-group list-group-flush">
        {#each $topics as tag}
            <li class="list-group-item">
                <Tag {tag} /> <a href="#top" class=" text-secondary float-end" on:click|preventDefault={() => delTopic(tag)}><i class="bi bi-x-circle-fill"></i></a>
            </li>
        {/each}
    </ul>
    
</div>

