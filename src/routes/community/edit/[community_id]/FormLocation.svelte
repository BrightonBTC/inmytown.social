<script lang="ts">
    import { community, signalUpdMap } from "./stores";
    import Map from "./Map.svelte";

    import LocationSelect from "$lib/location/LocationSelect.svelte";

    const signal = $signalUpdMap;

    function locChanged(city: City){
        $community.meta.city = city.name
        $community.meta.country = city.country
        $community.meta.latitude = parseFloat(city.lat)
        $community.meta.longitude = parseFloat(city.lng)
        $community.meta.zoom = 9
        signalUpdMap.update(()=> signal);
    }
</script>
<div class="container-fluid">
    <div class="row bg-secondary text-light border p-2 rounded">
        <div class="col-sm-6">
            <h4>Where is your community located?</h4>
            <p><small>Select your location and reposition the map to represent the approximate area your community serves.</small></p>

            <LocationSelect country={$community.meta.country} city={$community.meta.city} callback={locChanged} />

        </div>
        <div class="col-sm-6">
            <Map />
        </div>
    </div>
</div>

