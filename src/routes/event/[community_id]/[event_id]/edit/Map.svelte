<script lang="ts">
    import "ol/ol.css";
    import Map from "ol/Map.js";
    import OSM from "ol/source/OSM.js";
    import TileLayer from "ol/layer/Tile.js";
    import View from "ol/View.js";
    import {useGeographic} from 'ol/proj.js';

    import { onMount } from "svelte";
    import { meetupStore, signalUpdMap } from "./stores";
    import { defaults } from "ol/interaction/defaults";
    import Style from "ol/style/Style";
    import Icon from "ol/style/Icon";
    import Feature from "ol/Feature";
    import Point from "ol/geom/Point";
    import VectorLayer from "ol/layer/Vector";
    import VectorSource from "ol/source/Vector";

    let map: Map;
    let point;
    let iconFeature: Feature<Point>;
    useGeographic();

    export const updMap = function(){

        if (map !== undefined){
            point = new Point([$meetupStore.meta.longitude, $meetupStore.meta.latitude])
            iconFeature.setGeometry(point)
            map.getView().animate({zoom: 14}, {center: [$meetupStore.meta.longitude, $meetupStore.meta.latitude]});
        }
        
    };
    $: updMap(), $signalUpdMap;

    function createStyle(src:string) {
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
        point = new Point([$meetupStore.meta.longitude, $meetupStore.meta.latitude])
        
        iconFeature = new Feature(point);
        iconFeature.set('style', createStyle('/img/meetupicon.png'));
        map = new Map({
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
                minZoom: 1,
                maxZoom: 20
            }),
            interactions: defaults({mouseWheelZoom: false})
        });
        map.getView().on('change:center', (event) => {
            let c = map.getView().getCenter();
            $meetupStore.meta.latitude = (c !== undefined ? c[1] : 0); 
            $meetupStore.meta.longitude = (c !== undefined ? c[0] : 0); 
            point = new Point([$meetupStore.meta.longitude, $meetupStore.meta.latitude])
            iconFeature.setGeometry(point)
        });
    });
</script>

<div id="map" class="mb-1 mt-5" />
<small class="text-muted mb-5">
    Lat: {$meetupStore.meta.latitude} <br>
    Lon: {$meetupStore.meta.longitude}  
</small>
<style>
    #map {
        height: 500px;
        width: 100%;
    }
</style>