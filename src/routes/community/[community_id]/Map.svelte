<script lang="ts">
    import "ol/ol.css";
    import Map from "ol/Map.js";
    import OSM from "ol/source/OSM.js";
    import TileLayer from "ol/layer/Tile.js";
    import View from "ol/View.js";
    import {useGeographic} from 'ol/proj.js';
    import PointerInteraction from 'ol/interaction/Pointer.js';

    import { onMount } from "svelte";
    import { defaults } from "ol/interaction/defaults";
    import type { CommunityMeta } from "$lib/community/community";

    export let communityDetails: CommunityMeta;


    onMount(() => {
        console.log(communityDetails)
        if(communityDetails.latitude && communityDetails.longitude && communityDetails.zoom){
            useGeographic();
            const map = new Map({
                target: "map",
                layers: [
                    new TileLayer({
                        source: new OSM(),
                    }),
                ],
                view: new View({
                    center: [communityDetails.longitude, communityDetails.latitude],
                    zoom: communityDetails.zoom,
                }),
                interactions: defaults({mouseWheelZoom: false})
            });
            
        }
        
    });
</script>
{#if communityDetails.latitude && communityDetails.longitude && communityDetails.zoom}
<div id="map" class="mb-4 mt-5" />
{/if}

<style>
    #map {
        height: 300px;
        width: 100%;
    }
</style>
