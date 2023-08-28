<script>
    import Footer from "$lib/Footer.svelte";
    import Menu from "$lib/Menu.svelte";
</script>

<Menu />
<div class="container mt-1 main">
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
</style>