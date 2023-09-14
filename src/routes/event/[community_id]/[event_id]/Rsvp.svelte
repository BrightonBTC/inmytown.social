<script lang="ts">
    import { goto } from "$app/navigation";
    import { hasSigner } from "$lib/stores";
    import { meetupStore } from "./stores";

    export let hasRsvp:string;

    let rclass: string;
    let s: string;
    let overide: boolean = false;

    $: setUI(), hasRsvp

    async function rsvp(state: string){
        if($hasSigner){
            $meetupStore.rsvp(state)
            overide = false;
        }
        else{
            // let el = document.querySelector("[data-bs-target='#loginModal']")
            // if(el) el.click()
            goto('/login')
        }
    }

    function setUI(){
        switch(hasRsvp){
            case 'accepted':
                rclass = 'bg-success';
                s = "You're going to this event!"
            break;
            case 'tentative':
                rclass = 'bg-primary';
                s = "You're interested in this event!"
            break;
            case 'declined':
                rclass = 'bg-info';
                s = "You're not going to this event."
            break;
        }
    }

    function setOveride(){
        overide = true
    }
</script>
<div class="mt-2 text-center bg-secondary rounded border p-2">
    {#if !hasRsvp || overide}
        <button type="button" class="btn btn-success" on:click={() => rsvp("accepted")}
            >I'm going!</button
        >
        <button
            type="button"
            class="btn btn-primary"
            on:click={() => rsvp("tentative")}>I'm interested!</button
        >
        <button type="button" class="btn btn-info" on:click={() => rsvp("declined")}
            >I can't make it.</button
        >
    {:else}
        <span class="badge p-2 {rclass}">{s}</span> <a href="#t" on:click|preventDefault={() => setOveride()}><i class="bi bi-pencil-fill"></i></a>
    {/if}

</div>
