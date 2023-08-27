<script lang="ts">
    import { communityMetaStore, signalUpdMap } from "./stores";
    import Map from "./Map.svelte";

    import LocationSelect from "$lib/location/LocationSelect.svelte";

    const signal = $signalUpdMap;

    function locChanged(city: City){
        $communityMetaStore.city = city.name
        $communityMetaStore.country = city.country
        $communityMetaStore.latitude = parseFloat(city.lat)
        $communityMetaStore.longitude = parseFloat(city.lng)
        $communityMetaStore.zoom = 9   
        $communityMetaStore = $communityMetaStore
        signalUpdMap.update(()=> signal);
    }
</script>
<div class="container-fluid">
    <div class="row bg-secondary text-light border p-2 rounded">
        <div class="col-sm-6">
            <h4>Where is your community located?</h4>
            <p><small>Select your location and reposition the map to represent the approximate area your community serves.</small></p>

            <LocationSelect country={$communityMetaStore.country} city={$communityMetaStore.city} callback={locChanged} />

        </div>
        <div class="col-sm-6">
            <Map />
        </div>
    </div>
</div>

