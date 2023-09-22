<script lang="ts">
    import LocationSelect from "$lib/location/LocationSelect.svelte";
    import { searchCity, searchCountry } from "$lib/stores/persistent";

    function locChanged(city: City){
        searchCity.set(city.name) 
        searchCountry.set(city.country) 
    }
</script>

<div class="bg-secondary border p-2 rounded shadow-sm">
    <LocationSelect country={$searchCountry} city={$searchCity} callback={locChanged} />
</div>

