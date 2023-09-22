<script>
    import Footer from "$lib/Footer.svelte";
    import Menu from "$lib/Menu.svelte";
    import { login } from "$lib/user/user";
    import { onMount } from "svelte";
    import { onDestroy } from "svelte";
    import ndk from "$lib/ndk";

    let inactiveFor = 0;
    let noticeDismissed = false;

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
<div class="container mt-1 main">
    {#if !noticeDismissed}
    <div class="alert alert-info d-flex">
        <span>Please note that this app is still in early development stages. It should be mostly working
            but things may break at times. Please report any bugs <a href ="https://github.com/BrightonBTC/inmytown.social" target="_blank">here</a>.
        </span>  
        <button type="button" class="btn-close float-end" on:click={() => noticeDismissed = true}></button>
    </div>
    {/if}
    <slot />
</div>

<Footer />
<style lang="scss">
.main{
    min-height: 100vh;
    padding-top:70px;
}
:global([data-bs-theme="dark"]) {
    --bs-secondary-rgb: 47,54,61;
    --bs-body-font-family: var(--bs-font-monospace);
    --bs-tertiary-rgb: 58,69,75;
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
    background: rgb(var(--bs-dark-rgb));
    border-radius: 7px;
    font-weight: bold;
}

</style>