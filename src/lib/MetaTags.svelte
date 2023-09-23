<script lang="ts">
    import { page } from '$app/stores';
    import { imgUrlOrDefault } from './helpers';
    export let title:string;
    export let description:string | undefined;
    export let url:string ;
    export let image:string | undefined;

    url = $page.url.origin+url
    image = imgUrlOrDefault(image)
    title = title.substring(0, 100)
    description = description?.substring(0, 200) || title?.substring(0, 200)
</script>
<svelte:head>
    <title>{title}</title>
    <meta name="description" content={description} />
    
    <meta property="og:title" content={title} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={url} />
    <meta property="og:image" content={image} />
    
    <meta name="twitter:card" content="summary_large_image" />
    <meta property="twitter:domain" content="inmytown.social" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta property="twitter:url" content={url} />
    <meta name="twitter:image" content={image} />
</svelte:head>
