<script lang="ts">
    import { meetupStore, signalUpdMap } from "./stores";
    import Map from "./Map.svelte";
    import LocationSelect from "$lib/location/LocationSelect.svelte";

    const signal = $signalUpdMap;

    function locChanged(city: City){
        $meetupStore.meta.city = city.name
        $meetupStore.meta.country = city.country
        $meetupStore.meta.latitude = parseFloat(city.lat)
        $meetupStore.meta.longitude = parseFloat(city.lng)
        //$eventMetaStore = $eventMetaStore
        signalUpdMap.update(()=> signal);
    }
</script>
<div class="container-fluid">
    <div class="row bg-secondary border p-2 rounded">
        <div class="col-sm-6 text-light">
            <h4>Where will your event be held?</h4>

            <LocationSelect country={$meetupStore.meta.country} city={$meetupStore.meta.city} callback={locChanged} />

            {#if $meetupStore.meta.country != ''}

            <div class="mb-3 mt-2">
                <label for="im" class="form-label text-muted">Venue:</label>
                <input
                    type="text"
                    class="form-control"
                    id="venue"
                    placeholder="Name / short address of the venue"
                    name="venue"
                    bind:value={$meetupStore.meta.venue}
                />
            </div>
            {/if}
             
        </div>
        <div class="col-sm-6">
            <Map />
        </div>
    </div>
</div>

