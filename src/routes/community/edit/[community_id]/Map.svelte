<script lang="ts">
    import "ol/ol.css";
    import Map from "ol/Map.js";
    import OSM from "ol/source/OSM.js";
    import TileLayer from "ol/layer/Tile.js";
    import View from "ol/View.js";
    import {useGeographic} from 'ol/proj.js';

    import { onMount } from "svelte";
    import { communityMetaStore, signalUpdMap } from "./stores";
    import { defaults } from "ol/interaction/defaults";

    let map: Map;
    useGeographic();

    export const updMap = function(){

        if (map && $communityMetaStore.longitude && $communityMetaStore.latitude){
            map.getView().animate({zoom: $communityMetaStore.zoom}, {center: [$communityMetaStore.longitude, $communityMetaStore.latitude]});
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
                center: [$communityMetaStore.latitude, $communityMetaStore.longitude],
                zoom: $communityMetaStore.zoom,
                minZoom: 1,
                maxZoom: 20
            }),
            interactions: defaults({mouseWheelZoom: false})
        });
        map.getView().on('change:resolution', (event) => {
            let z = map.getView().getZoom();
            if(z){
                $communityMetaStore.zoom = z
                $communityMetaStore = $communityMetaStore
            }
        });
        map.getView().on('change:center', (event) => {
            let c = map.getView().getCenter();
            $communityMetaStore.longitude = (c !== undefined ? c[1] : 0); 
            $communityMetaStore.latitude = (c !== undefined ? c[0] : 0); 
            $communityMetaStore = $communityMetaStore
        });
    });
</script>

<div id="map" class="mb-1 mt-5" />
<small class="text-muted mb-5">
    Lat: {$communityMetaStore.latitude} <br>
    Lon: {$communityMetaStore.longitude}  <br>
    Zoom: {$communityMetaStore.zoom}
</small>
<style>
    #map {
        height: 500px;
        width: 100%;
    }
</style>