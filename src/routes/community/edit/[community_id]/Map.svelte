<script lang="ts">
    import "ol/ol.css";
    import Map from "ol/Map.js";
    import OSM from "ol/source/OSM.js";
    import TileLayer from "ol/layer/Tile.js";
    import View from "ol/View.js";
    import {useGeographic} from 'ol/proj.js';

    import { onMount } from "svelte";
    import { community, signalUpdMap } from "./stores";
    import { defaults } from "ol/interaction/defaults";

    let map: Map;
    useGeographic();

    export const updMap = function(){

        if (map && $community.meta.longitude && $community.meta.latitude){
            map.getView().animate({zoom: 9}, {center: [$community.meta.longitude, $community.meta.latitude]});
        }
        
    };
    $: updMap(), $signalUpdMap;

    onMount(() => {
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
                minZoom: 1,
                maxZoom: 20
            }),
            interactions: defaults({mouseWheelZoom: false})
        });
        // map.getView().on('change:resolution', (event) => {
        //     let z = map.getView().getZoom();
        //     if(z){
        //         $community.meta.zoom = z
        //         $community.meta = $community.meta
        //     }
        // });
        map.getView().on('change:center', (event) => {
            let c = map.getView().getCenter();
            $community.meta.longitude = (c !== undefined ? c[0] : 0); 
            $community.meta.latitude = (c !== undefined ? c[1] : 0); 
        });
    });
</script>

<div id="map" class="mb-1 mt-5" />
<small class="text-muted mb-5">
    Lat: {$community.meta.latitude} <br>
    Lon: {$community.meta.longitude}  <br>
    <!-- Zoom: {$community.meta.zoom} -->
</small>
<style>
    #map {
        height: 300px;
        width: 100%;
    }
</style>