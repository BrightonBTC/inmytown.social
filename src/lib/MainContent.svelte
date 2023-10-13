<script lang="ts">

    import Loading from "$lib/Loading.svelte";
    import { navigating } from "$app/stores";
    import { noticeDismissed } from "$lib/stores/persistent";

    let showNotice:boolean = false
    function setShowNotice(){
        if($noticeDismissed.length < 1 || parseInt($noticeDismissed)+86400000 < Date.now()) showNotice = true
        else showNotice = false
    }

    $: $noticeDismissed, $navigating, setShowNotice()

</script>
<div class="container mt-1 main">
    {#if showNotice}
    <div class="alert alert-info d-flex">
        <span>Please note that this app is still in early development stages. It should be mostly working
            but things may break at times. Please report any bugs <a href ="https://github.com/BrightonBTC/inmytown.social" target="_blank">here</a>.
        </span>  
        <button type="button" class="btn-close float-end" on:click={() => $noticeDismissed = Date.now().toString()}></button>
    </div>
    {/if}
    {#if $navigating}
        <Loading t="Scanning the Nostrverse..." />
    {:else}
        <slot />
    {/if}
</div>
<slot name="outer" />

<style>
    .main{
        min-height: 100vh;
        padding-top:90px;
    }
</style>