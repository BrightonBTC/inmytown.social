<script lang="ts">
    import LocationSearch from "./LocationSearch.svelte";
    import type { NDKFilter } from "@nostr-dev-kit/ndk";
    import { addCommunity, addEvent, addPerson, addTopic, communityList, eventList, personList, searchType, sortedCommunities, topics } from "./stores";
    import { searchCity, searchCountry } from "$lib/stores";
    import { onDestroy, onMount } from "svelte";
    import CommunityCardLarge from "$lib/community/CommunityCardLarge.svelte";
    import TypeSwitch from "./TypeSwitch.svelte";
    import EventTabs from "./EventTabs.svelte";
    import type { Tag } from "./+page";
    export let data:Tag;  
    import TopicSelector from "./TopicSelector.svelte";
    import ResultsInfo from "./ResultsInfo.svelte";
    import UserList from "./UserList.svelte";
    import ndk from "$lib/ndk";
    import { CommunitySubscriptions } from "$lib/community/community";
    import { EventSubscriptions } from "$lib/event/event";
    import { UserSubscriptions } from "$lib/user/user";

    let communitySubs = new CommunitySubscriptions(ndk);
    let eventSubs = new EventSubscriptions(ndk);
    let userSubs = new UserSubscriptions(ndk);

    $: tag = data.tag;

    $: fetchSearch(), $searchCountry, $searchCity, $searchType, tag

    // onMount(async () => {
    //     fetchSearch();
    // });
    onDestroy(() => {
        communitySubs.closeSubscriptions();
        eventSubs.closeSubscriptions();
        userSubs.closeSubscriptions();
    })

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
        communityList.set([])
        eventList.set([])
        personList.set([])
        setTopics();
        let cityFilter: NDKFilter = {}
        let topicFilter: NDKFilter = {}
        
        if($searchCountry.length > 0 && $searchCity.length > 0){
            cityFilter = {
                "#g": [$searchCountry + ':' + $searchCity]
            }
        }
        
        if($topics.length){
            topicFilter = {'#t': $topics}
        }

        switch($searchType){
            case 'communities':
                communitySubs.subscribeMetaMulti({...cityFilter, ...topicFilter}, (data) => {
                    addCommunity(data)
                }, {closeOnEose: false, groupable: false})
            break;
            case 'events':
                communitySubs.subscribeMetaMulti(cityFilter, (data) => {
                    eventSubs.subscribe({...topicFilter, '#e':[data.eid]}, (data) => {
                        addEvent(data)
                    })
                }, {closeOnEose: false, groupable: false})
                
            break;
            case 'people':
                userSubs.subscribeStatuses({...cityFilter, ...topicFilter}, (data) => {
                    addPerson(data)
                }, {closeOnEose: false, groupable: false})
            break;
        }

        if(typeof window !== 'undefined') window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
</script>
{#if $searchCity && $searchCountry}  
    <div class="row">
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
                <EventTabs />
            {:else}
                <UserList />
            {/if}
        </div>
    </div>
{:else}
<p>Please set a location to get started:</p>
<LocationSearch />
{/if}