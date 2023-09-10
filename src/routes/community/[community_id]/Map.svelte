<script lang="ts">
    import "ol/ol.css";
    import Map from "ol/Map.js";
    import OSM from "ol/source/OSM.js";
    import TileLayer from "ol/layer/Tile.js";
    import View from "ol/View.js";
    import {useGeographic} from 'ol/proj.js';
    import {community} from "./stores";

    import { defaults } from "ol/interaction/defaults";
    import { onMount } from "svelte";

    let map:Map;

    $: updMap(), $community.meta

    function initMap(){
        console.log('initMap')
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
                zoom: $community.meta.zoom,
            }),
            interactions: defaults({mouseWheelZoom: false})
        });
    }
    onMount(() => {
        initMap()
    })

    function updMap(){
        console.log('updMap')
        if(!map) initMap()
        map.getView().animate({zoom: $community.meta.zoom}, {center: [$community.meta.longitude, $community.meta.latitude]});
    };

</script>

<div id="map" class="mb-4 mt-5" />

<style>
    #map {
        height: 300px;
        width: 100%;
    }
</style>
