<script lang="ts">
    import { goto } from "$app/navigation";
    import { hasSigner } from "$lib/stores";
    import NDK, { NDKEvent } from "@nostr-dev-kit/ndk";

    export let hasRsvp:string;
    export let ndk:NDK;
    export let event_id:string;

    let rclass: string;
    let s: string;
    let overide: boolean = false;

    $: setUI(), hasRsvp

    async function rsvp(state: string){
        if($hasSigner){
            const ndkEvent = new NDKEvent(ndk);
            ndkEvent.kind = 30038;
            ndkEvent.tags = [
                ["rsvp", state],
                ["d", event_id]
            ];
            await ndkEvent.publish();
            overide = false;
        }
        else{
            goto('/login')
        }
    }

    function setUI(){
        switch(hasRsvp){
            case 'going':
                rclass = 'bg-success';
                s = "You're going to this event!"
            break;
            case 'interested':
                rclass = 'bg-primary';
                s = "You're interested in this event!"
            break;
            case 'not':
                rclass = 'bg-info';
                s = "You're not going to this event."
            break;
        }
    }

    function setOveride(){
        overide = true
    }
</script>
{#if !hasRsvp || overide}
    <button type="button" class="btn btn-success" on:click={() => rsvp("going")}
        >I'm going!</button
    >
    <button
        type="button"
        class="btn btn-primary"
        on:click={() => rsvp("interested")}>I'm interested!</button
    >
    <button type="button" class="btn btn-info" on:click={() => rsvp("not")}
        >I can't make it.</button
    >
{:else}
    <span class="badge p-2 {rclass}">{s}</span> <a href="#t" on:click|preventDefault={() => setOveride()}><i class="bi bi-pencil-fill"></i></a>
{/if}
