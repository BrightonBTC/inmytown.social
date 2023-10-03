<script lang="ts">
    import { EventSubscriptions } from "$lib/event/event";
    import { loggedInUser } from "$lib/stores/user";
    import ndk from "$lib/stores/ndk";
    import { addEvent, community, eventList, signalUpdMap } from "./stores";
    import { meetupStore } from "./stores";

    let eventSubs = new EventSubscriptions($ndk);
    let selectedEvent:string;

    async function fetchEvents() {
        if(!$loggedInUser) return
        eventSubs.subscribe({"#e": [$community.meta.eid], authors:[$loggedInUser.hexpubkey()]}, async (data) => {
            addEvent(data)
        });
    }
    fetchEvents()

    function loadEvent(){
        let e = $eventList.filter((evt) => evt.eid === selectedEvent)
        $meetupStore.meta = e[0]
        let t = new Date()
        t.setDate(t.getDate() + 1)
        t.setHours(18)
        t.setMinutes(0)
        t.setMilliseconds(0)
        $meetupStore.meta.starts = t.getTime()/1000
        t.setHours(22)
        $meetupStore.meta.ends = t.getTime()/1000
        $signalUpdMap = {}
    }
</script>
<div class="alert alert-info d-flex align-items-center">
    <label for="dup">Duplicate a previous event:</label> 
    <select name="dup" id="dup" class="form-select" bind:value={selectedEvent} on:change={() => loadEvent()}>
        <option value=""></option>
        {#each $eventList as event}
            <option value="{event.eid}">{event.title}</option>
        {/each}
    </select>
</div>
<style>
    select{
        max-width: 200px;
    }
    .d-flex{
        gap:5px;
    }
</style>