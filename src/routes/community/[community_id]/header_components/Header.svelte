<script lang="ts">
    import "bootstrap-icons/font/bootstrap-icons.css";
    import { imgUrlOrDefault } from "$lib/helpers";
    import Location from "$lib/location/Location.svelte";
    import {community} from "../stores/store.community";
    import MembersRow from "./MembersRow.svelte";
    import HostRow from "./HostRow.svelte";
    import Join from "./Join.svelte";
</script>


<div class="card mb-3 p-1 shadow-sm">
    <div class="row g-0">
        <div class="col-lg-7">
            <img
            src={imgUrlOrDefault($community.meta.image, 'community')}
            alt={$community.meta.title}
            class="img-fluid rounded header-image"
            />
        </div>
        <div class="col-lg-5">
            
            <div class="card-body">
                <h1 class="card-title"><b>{$community.meta.title}</b></h1>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                        <Location city={$community.meta.city} country={$community.meta.country} />
                    </li>
                    <MembersRow />
                    <HostRow />
                </ul>
                <Join />
            </div>
        </div>
        
    </div>
</div>

<style>
    .header-image {
        object-fit: cover; 
        width: 100%;
        aspect-ratio: 16/9;
    }
</style>