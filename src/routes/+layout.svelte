<script lang="ts">
    import Footer from "$lib/Footer.svelte";
    import Menu from "$lib/Menu.svelte";
    import { login } from "$lib/user/user";
    import { onMount } from "svelte";
    import { onDestroy } from "svelte";
    import ndk from "$lib/stores/ndk";

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

</script> 

<Menu />
<slot />

<Footer />
<style lang="scss">

:global([data-bs-theme="dark"]) {
    --bs-secondary-rgb: 20,35,60;
    --bs-body-font-family: sans-serif;
    --bs-tertiary-rgb: 58,69,75;
    --bs-body-bg: #0d161e;
    --bs-dark: #060c10;
    --bs-dark-rgb: 6, 12, 16;
    --bs-border-color-translucent: rgba(41, 72, 104, 0.5);
    --bs-border-color: #294868;
}
:global([data-bs-theme="dark"] body) {
    background-image: linear-gradient(180deg, rgba(var(--bs-primary-rgb), .15), transparent);
    background-size: 30% 70%;
    background-repeat: repeat-x;
    background-attachment: fixed;
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
}
:global([data-bs-theme="dark"] .page-home .nav-home, .page-discover .nav-discover, .page-about .nav-about){
    background: rgb(var(--bs-secondary-rgb));
    border-radius: 7px;
    font-weight: bold;
}
:global([data-bs-theme="dark"] .navbar .nav-link:not(.u-icon *):hover){
    filter: brightness(1.2);
    backdrop-filter: brightness(2);
    border-radius: 7px;
}

</style>