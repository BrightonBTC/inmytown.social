<script lang="ts">
    import type NDK from "@nostr-dev-kit/ndk";
    import LocationSearch from "./LocationSearch.svelte";
    import type { NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";
    import { addCommunity, addEvent, addPerson, addTopic, communityList, eventListPast, eventListUpcoming, personList, searchType, sortedCommunities, topics } from "./stores";
    import { searchCity, searchCountry } from "$lib/stores";
    import { onMount } from "svelte";
    import CommunityCardLarge from "$lib/community/CommunityCardLarge.svelte";
    import TypeSwitch from "./TypeSwitch.svelte";
    import { loadNDK } from "$lib/nostr";
    import EventTabs from "./EventTabs.svelte";
    import type { Tag } from "./+page";
    import TopicSelector from "./TopicSelector.svelte";
    import ResultsInfo from "./ResultsInfo.svelte";
    import UserList from "./UserList.svelte";
    export let data:Tag;   
    let ndk: NDK;

    $: tag = data.tag;

    $: fetchSearch(), $searchCountry, $searchCity, $searchType, tag

    onMount(async () => {
        ndk = await loadNDK();
        fetchSearch();
    });

    function setTopics(){
        topics.set([])
        if(tag){
            let ts = tag.split(',')
            ts.forEach(function(t){
                addTopic(t)
            })
        }
    }

    async function fetchSearch() {
        if(!ndk) return;
        communityList.set([])
        eventListUpcoming.set([])
        eventListPast.set([])
        personList.set([])
        setTopics();
        let kind:number = 30037
        if($searchType === 'events'){
            kind = 30073;
        }
        else if($searchType === 'people'){
            kind = 10037;
        }
        let f: NDKFilter = {
            kinds: [kind],
        }
        
        if($searchCountry.length > 0 && $searchCity.length > 0){
            f = {
                kinds: [kind],
                "#c": [$searchCity + ' ' + $searchCountry]
            }
        }
        
        
        if($topics.length){
            console.log($topics)
            let tf = {'#t': $topics}
            f = {...f, ...tf}
        }
        const communitiesSub = ndk.subscribe(
            f,
            { closeOnEose: false }
        );
        communitiesSub.on("event", (event: NDKEvent) => {
            console.log(event)
            if(event.kind === 30037) addCommunity(event);
            else if (event.kind === 30073){
                addEvent(event);
            } 
            else{
                addPerson(event)
            }
        });
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
</script>
{#if $searchCity && $searchCountry}  
    <div class="row me-1">
        <div class="col-lg-3 pt-2 pb-4">
            <LocationSearch />
            <TypeSwitch />
            <TopicSelector />
        </div>
        
        <div class="col-lg-9">
            <ResultsInfo />
            {#if $searchType === 'communities'}
            <div class="row">
                {#each Object.values($sortedCommunities) as communityDetails, i}
                <div class="col-md-6 mb-0 d-flex">
                    <CommunityCardLarge {communityDetails} />
                </div>
                
                {/each}
                
            </div>
            {:else if  $searchType === 'events'}
                <EventTabs {ndk} />
            {:else}
                <UserList {ndk} />
            {/if}
        </div>
    </div>
{:else}
<p>Please set a location to get started:</p>
<LocationSearch />
{/if}