<script lang="ts">
    import { eventMetaStore, signalUpdMap } from "./stores";
    import Map from "./Map.svelte";
    import LocationSelect from "$lib/location/LocationSelect.svelte";

    const signal = $signalUpdMap;

    function locChanged(city: City){
        $eventMetaStore.city = city.name
        $eventMetaStore.country = city.country
        $eventMetaStore.latitude = parseFloat(city.lat)
        $eventMetaStore.longitude = parseFloat(city.lng)
        $eventMetaStore = $eventMetaStore
        signalUpdMap.update(()=> signal);
    }
</script>
<div class="container-fluid">
    <div class="row bg-secondary border p-2 rounded">
        <div class="col-sm-6 text-light">
            <h4>Where will your event be held?</h4>

            <LocationSelect country={$eventMetaStore.country} city={$eventMetaStore.city} callback={locChanged} />

            {#if $eventMetaStore.country != ''}

            <div class="mb-3 mt-2">
                <label for="im" class="form-label text-muted">Venue:</label>
                <input
                    type="text"
                    class="form-control"
                    id="venue"
                    placeholder="Name / short address of the venue"
                    name="venue"
                    bind:value={$eventMetaStore.venue}
                />
            </div>
            {/if}
             
        </div>
        <div class="col-sm-6">
            <Map />
        </div>
    </div>
</div>

