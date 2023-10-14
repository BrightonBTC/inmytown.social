<script lang="ts">
    import { suggestedRelays } from "$lib/stores/persistent";
    import { relays, selectedRelays } from "$lib/stores/persistent";

    let newRelay: string;
    let inList = new Set(relays);

    let availableRelays: string[]
    let activeRelays: string[]

    //$: availableRelays = suggestedRelays.filter((x) => !inList.has(x));

    $: setAvailableRelays(), $selectedRelays

    function setAvailableRelays(){
        inList = new Set(relays);
        availableRelays = suggestedRelays.filter((x) => !inList.has(x));
        activeRelays = relays
    }

    function addRelay() {
        relays.push(newRelay);
        selectedRelays.set(JSON.stringify(relays));
        newRelay = ""
    }
    function addFromList(relay: string){
        newRelay = relay;
        addRelay()
    }
    function removeFromList(relay: string){
        let r = relays.filter(x => x !== relay)
        selectedRelays.set(JSON.stringify(r));
    }
</script>
<div class="col-sm-6">
    <h4>Selected relays</h4>
    <form on:submit|preventDefault={() => addRelay()}>
        <div class="mb-3 mt-3">
            <input
                type="text"
                class="form-control"
                id="newRelay"
                placeholder="wss://"
                name="newRelay"
                bind:value={newRelay}
                style="width:50%; float:left"
            /><button type="submit" class="btn btn-primary">+</button>
        </div>
    </form>
    <ul class="list-group list-group-flush">
        {#each activeRelays as relay}
        <li class="list-group-item">
            <a href="#l"  on:click|preventDefault={() => removeFromList(relay)}><i class="bi bi-x-square text-danger"></i></a> {relay} 
        </li>
        {/each}
    </ul>
</div>
<div class="col-sm-6">
    <h4>Other popular relays</h4>
    <ul class="list-group list-group-flush">
        {#each availableRelays as relay}
        <li class="list-group-item">
            <a href="#l"  on:click|preventDefault={() => addFromList(relay)}><i class="bi bi-plus-square-fill text-muted"></i></a> {relay} 
        </li>
        {/each}
    </ul>
</div>
