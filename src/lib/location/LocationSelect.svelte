<script lang="ts">
    import cities from "cities.json";
    import countries from "$lib/countries.json";
    import Location from "./Location.svelte";

    let cityObj: City;

    let filteredCities: Array<City>;
    let filteredTowns: Array<City>;
    let cityList: HTMLUListElement;

    export let city: string | undefined;
    export let country: string | undefined;

    let origCity = city;
    let origCountry = country;
    let isSaveable: boolean = false;
    $: setIsSaveable(), city, country

    $: filteredTowns =
        city && city.length > 0
            ? filteredCities.filter((x) =>
                  city
                      ? x.name.toLowerCase().startsWith(city.toLowerCase())
                      : []
              )
            : [];

    $: filteredCities = cities.filter((x) => x.country == country);

    const showCityList = function () {
        cityList.style.display = "block";
    };
    const hideCityList = function () {
        setTimeout(function () {
            cityList.style.display = "none";
        }, 500);
    };

    const setCity = function (c: City) {
        city = c.name;
        cityObj = c;
    };
    const setCountry = function () {
        city = "";
    };

    export let callback = (city: City) => {};

    function saveLocation(){
        if (city && country){
            callback(cityObj);
            origCity = city;
            origCountry = country;
        } 
    }

    function setIsSaveable(){
        if (city && country) isSaveable = true;
        else isSaveable = false;
    }
</script>

<Location city={origCity} country={origCountry} /> <i
    class="bi bi-pencil-fill text-primary"
    data-bs-toggle="modal"
    data-bs-target="#locModal"
/>

<div class="modal" id="locModal">
    <div class="modal-dialog  modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Change the location:</h4>
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                />
            </div>

            <div class="modal-body">
                <div class="d-flex">
                    <div class="me-1">
                        <select
                            class="form-select"
                            id="country"
                            bind:value={country}
                            on:change={() => setCountry()}
                        >
                            <option value="">-- select country --</option>
                            {#each Object.values(countries.ref_country_codes) as country}
                                <option value={country.alpha2}
                                    >{country.alpha2} [{country.country}]</option
                                >
                            {/each}
                        </select>
                    </div>
                    <div>
                        {#if country != ""}
                            <div>
                                <input
                                    type="searchTown"
                                    class="form-control"
                                    id="searchTown"
                                    placeholder="Town/City"
                                    name="searchTown"
                                    bind:value={city}
                                    on:focus={() => showCityList()}
                                    on:blur={() => hideCityList()}
                                />
                                <ul class="list-group cityList" bind:this={cityList}>
                                    {#each filteredTowns as t}
                                        <li class="list-group-item">
                                            <a
                                                href="#top"
                                                on:click|preventDefault={() => setCity(t)}
                                                >{t.name}</a
                                            >
                                        </li>
                                    {/each}
                                </ul>
                            </div>
                        {/if}
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                {#if isSaveable}
                <!-- <button
                    type="button"
                    class="btn btn-success"
                    data-bs-dismiss="modal"
                    on:click={saveLocation}
                    >Save</button
                > -->
                <button
                    type="button"
                    class="text-success bg-secondary rounded border-0"
                    data-bs-dismiss="modal"
                    on:click|preventDefault={saveLocation}
                    ><i class="bi bi-check-lg" /></button
                >
                {:else}
                <!-- <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-toggle="tooltip"
                    title="ensure both a country and city are selected first!"
                    >Save</button
                > -->
                <button
                    type="button"
                    class="text-muted bg-secondary rounded border-0"
                    data-bs-toggle="tooltip"
                    title="ensure both a country and city are selected first!"
                    ><i class="bi bi-check-lg" /></button
                >
                {/if}
            </div>
        </div>
    </div>
</div>
<style>
	i {
		font-size: 1rem;
	}
    .bi-pencil-fill{
        cursor: pointer;
    }
    .cityList {
        position: absolute;
        z-index: 2000;
        filter: drop-shadow(2px 4px 6px #ccc);
        display: none;
    }
    .bi-check-lg {
        font-size: 2rem;
    }
</style>