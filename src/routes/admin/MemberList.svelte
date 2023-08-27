<script lang="ts">
    import { fetchCommunity } from "$lib/community/community";
    import { imgUrlOrDefault } from "$lib/helpers";
    import { follows } from "$lib/stores";
    import type NDK from "@nostr-dev-kit/ndk";

    export let ndk: NDK | undefined;

</script>
<h3 class="mb-4 mt-5">Communities you're a member of:</h3>
{#if ndk}
<ul class="list-group">
    {#each follows as c}
        {#await fetchCommunity(ndk, c[1])}
            <li class="list-group-item">fetching : {c[1]}</li>
        {:then v}
            {#if v}
                <li class="list-group-item">
                    <img
                        src={imgUrlOrDefault(v.image)}
                        alt={v.title}
                        class="mini-banner rounded-circle me-3"
                    />
                    <a href="/community/{c[1]}">{v.title}</a>
                </li>
            {:else}
                <li class="list-group-item list-group-item-warning d-flex">
                    <i class="bi bi-exclamation-triangle me-3" />
                    <div>
                        Failed to fetch community. You may need to connect to a
                        different relay set to retrieve it.
                        <br /> <small class="text-muted">{c[1]}</small>
                    </div>
                </li>
            {/if}
        {:catch e}
            <li class="list-group-item">
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle" />
                    {e}
                    <br /> <small>{c[1]}</small>
                </div>
            </li>
            <p>{e}</p>
        {/await}
    {/each}
</ul>
{/if}

<style>
    i {
        font-size: 2rem;
    }
    .mini-banner {
        width: 60px;
        height: 60px;
        object-fit: cover;
    }
</style>