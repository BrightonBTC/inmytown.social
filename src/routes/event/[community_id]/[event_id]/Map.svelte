<script lang="ts">
    import "ol/ol.css";
    import Map from "ol/Map.js";
    import OSM from "ol/source/OSM.js";
    import TileLayer from "ol/layer/Tile.js";
    import View from "ol/View.js";
    import {useGeographic} from 'ol/proj.js';

    import { onMount } from "svelte";
    import { defaults } from "ol/interaction/defaults";
    import Style from "ol/style/Style";
    import Icon from "ol/style/Icon";
    import Feature from "ol/Feature";
    import { Point } from "ol/geom";
    import VectorLayer from "ol/layer/Vector";
    import VectorSource from "ol/source/Vector";
    import { meetupStore } from "./stores";


    function createStyle(src:string, lat:number, lng:number) {
        return new Style({
            image: new Icon({
                anchor: [15, 30],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                crossOrigin: 'anonymous',
                src: src,
                img: undefined,
                imgSize: undefined,
            }),
        });
    }

    onMount(() => {
        useGeographic();
        const iconFeature = new Feature(new Point([$meetupStore.meta.longitude, $meetupStore.meta.latitude]));
        iconFeature.set('style', createStyle('/img/meetupicon.png', $meetupStore.meta.latitude, $meetupStore.meta.longitude));
        const map = new Map({
            target: "map",
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                new VectorLayer({
                    style: function (feature) {
                        return feature.get('style');
                    },
                    source: new VectorSource({features: [iconFeature]}),
                }),
            ],
            view: new View({
                center: [$meetupStore.meta.longitude, $meetupStore.meta.latitude],
                zoom: 14,
            }),
            interactions: defaults({mouseWheelZoom: false})
        });
    });
</script>

<div id="map" class="mb-4 mt-2" />

<style>
    #map {
        height: 300px;
        width: 100%;
    }
</style>