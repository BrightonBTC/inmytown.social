<script lang="ts">
    import { communityList, eventListUpcoming, personList, searchType, topics } from "./stores";
    import { searchCity, searchCountry } from "$lib/stores";
    let n:number = 0;
    let resType: string = 'results';
    let filterStrings: Array<[string, string]> = [];

    $: buildResultInfo(), $searchType, $communityList, $eventListUpcoming, $personList

    function buildResultInfo(){
        filterStrings = []
        if($searchType === 'communities'){
            n = $communityList.length
            resType = 'communities'
        }
        else if($searchType === 'events'){
            n = $eventListUpcoming.length
            resType = 'upcoming events'
        }
        else if($searchType === 'people'){
            n = $personList.length
            resType = 'people'
        }
        if($searchCountry) filterStrings.push(['Country', $searchCountry])
        if($searchCity) filterStrings.push(['City',$searchCity])
        
        if($topics.length > 0) filterStrings.push(['Topics', $topics.join(', ')])
    }
</script>

<div class="bg-dark text-light rounded p-2 mb-4">
    Found <strong>{n}</strong> {resType}
    <div class="bg-secondary p-1 mt-2 rounded">
        <small>
            <strong>Filters:</strong>
                {#each filterStrings as f}
                    <span class="text-muted "><em>{f[0]}</em></span> {f[1]} &nbsp;
                {/each}
            
        </small>
    </div>
    
</div>