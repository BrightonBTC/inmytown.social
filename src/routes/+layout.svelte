<script lang="ts">
    import Footer from "$lib/Footer.svelte";
    import Menu from "$lib/Menu.svelte";
    import { login } from "$lib/user/user";
    import { onMount } from "svelte";
    import { onDestroy } from "svelte";
    import ndk from "$lib/stores/ndk";
    import { navigating } from "$app/stores";
    import Loading from "$lib/Loading.svelte";
    import { noticeDismissed } from "$lib/stores/persistent";

    let inactiveFor = 0;

    const interval = setInterval(() => {
        inactiveFor++;
    }, 60000)

    onMount(async () => {
        document.onmousemove = (e) => {
            if(inactiveFor > 30){
                location.reload()
            }
            inactiveFor = 0;
        }
        await login($ndk)
    })

    onDestroy(() => {
        clearInterval(interval)
    })

    let showNotice:boolean = false
    function setShowNotice(){
        if($noticeDismissed.length < 1 || parseInt($noticeDismissed)+86400000 < Date.now()) showNotice = true
        else showNotice = false
    }

    $: $noticeDismissed, $navigating, setShowNotice()
</script> 

<Menu />
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

<Footer />
<style lang="scss">
.main{
    min-height: 100vh;
    padding-top:70px;
}
:global([data-bs-theme="dark"]) {
    --bs-secondary-rgb: 47,54,69;
    --bs-body-font-family: sans-serif;
    --bs-tertiary-rgb: 58,69,75;
    --bs-body-bg: #0d161e;
    --bs-dark: #060c10;
    --bs-dark-rgb: 6, 12, 16;
}
:global([data-bs-theme="dark"] .shadow-sm, .btn) {
    box-shadow: 0 .125rem .25rem rgba(0,0,0, 0.5) !important;
}
:global([data-bs-theme="dark"] .shadow) {
    box-shadow: 0 .5rem 1rem rgba(0,0,0,.5) !important;
}
:global([data-bs-theme="dark"] .btn:focus) {
    box-shadow: none !important;
    opacity: 0.7;
}
:global([data-bs-theme="dark"] .h1, .h2, .h3, .h4, .h5, .h6, h1, h2, h3, h4, h5, h6) {
    margin-top: 0;
    margin-bottom: 1.5rem;
    font-weight: 500;
    line-height: 1.2;
    color: var(--bs-heading-color);
    font-family: 'Ubuntu', sans-serif;
    // background: linear-gradient(45deg, var(--bs-indigo), var(--bs-purple), var(--bs-indigo), var(--bs-indigo));
    // -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
}
:global([data-bs-theme="dark"] .page-home .nav-home, .page-discover .nav-discover, .page-about .nav-about){
    background: rgb(var(--bs-secondary-rgb));
    border-radius: 7px;
    font-weight: bold;
}
:global([data-bs-theme="dark"] .bg-gradient) {
    background: linear-gradient(45deg, var(--bs-black), var(--bs-dark), var(--bs-dark), rgb(var(--bs-tertiary-rgb)), var(--bs-dark), rgb(var(--bs-tertiary-rgb))) !important;
}
</style>