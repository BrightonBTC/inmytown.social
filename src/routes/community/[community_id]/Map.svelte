<script lang="ts">
    import "ol/ol.css";
    import Map from "ol/Map.js";
    import OSM from "ol/source/OSM.js";
    import TileLayer from "ol/layer/Tile.js";
    import View from "ol/View.js";
    import {useGeographic} from 'ol/proj.js';
    import {community} from "./stores";

    import { defaults } from "ol/interaction/defaults";

    $: showMap(), $community.meta

    const showMap = () => {
        if($community.meta.latitude && $community.meta.longitude && $community.meta.zoom){
            useGeographic();
            const map = new Map({
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
    }
    showMap()
</script>
{#if $community.meta.latitude && $community.meta.longitude && $community.meta.zoom}
<div id="map" class="mb-4 mt-5" />
{/if}

<style>
    #map {
        height: 300px;
        width: 100%;
    }
</style>
