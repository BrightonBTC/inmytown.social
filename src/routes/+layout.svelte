<script>
    import Footer from "$lib/Footer.svelte";
    import Menu from "$lib/Menu.svelte";
</script>

<Menu />
<div class="container mt-1 main">
    <slot />
</div>

<Footer />
<style>
.main{
    min-height: 100vh;
    padding-top:70px;
}
</style>