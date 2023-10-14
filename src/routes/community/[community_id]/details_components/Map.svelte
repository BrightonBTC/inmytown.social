<script lang="ts">
    import "ol/ol.css";
    import Map from "ol/Map.js";
    import OSM from "ol/source/OSM.js";
    import TileLayer from "ol/layer/Tile.js";
    import View from "ol/View.js";
    import {useGeographic} from 'ol/proj.js';
    import {community} from "../stores/store.community";

    import { defaults } from "ol/interaction/defaults";
    import { onMount } from "svelte";

    let map:Map;

    $: updMap(), $community.meta

    function initMap(){
        useGeographic();
        map = new Map({
            target: "map",
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: [$community.meta.longitude, $community.meta.latitude],
                zoom: 9,
            }),
            interactions: defaults({mouseWheelZoom: false})
        });
    }
    onMount(() => {
        initMap()
    })

    function updMap(){
        if(!map) initMap()
        map.getView().animate({zoom: 9}, {center: [$community.meta.longitude, $community.meta.latitude]});
    };

</script>

<div id="map" class="mb-4 mt-1" />

<style>
    #map {
        height: 300px;
        width: 100%;
    }
</style>
