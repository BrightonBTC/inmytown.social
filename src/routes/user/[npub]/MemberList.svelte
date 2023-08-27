<script lang="ts">
    import { fetchCommunity } from "$lib/community/community";
    import { imgUrlOrDefault } from "$lib/helpers";
    import type { UserStatus } from "$lib/user/user";
    import type NDK from "@nostr-dev-kit/ndk";

    export let statusData: UserStatus | undefined;
    export let ndk: NDK | undefined;
    
</script>

<h3>Member of:</h3>
{#if statusData && ndk}
    <ul class="list-group">
        {#each statusData.communities as c}
            {#await fetchCommunity(ndk, c)}
                <li class="list-group-item">fetching : {c}</li>
            {:then v}
                {#if v}
                    <li class="list-group-item">
                        <img
                            src={imgUrlOrDefault(v.image)}
                            alt={v.title}
                            class="mini-banner rounded-circle me-3"
                        />
                        <a href="/community/{c}">{v.title}</a>
                    </li>
                {:else}
                    <li class="list-group-item list-group-item-warning d-flex">
                        <i class="bi bi-exclamation-triangle me-3" />
                        <small>
                            Failed to fetch community. You may need to connect
                            to a different relay set to retrieve it.
                            <br /> <small class="text-muted">{c}</small>
                        </small>
                    </li>
                {/if}
            {:catch e}
                <li class="list-group-item">
                    <div class="alert alert-danger">
                        <i class="bi bi-exclamation-triangle" />
                        {e}
                        <br /> <small>{c}</small>
                    </div>
                </li>
                <p>{e}</p>
            {/await}
        {/each}
    </ul>
{/if}

<style>
    i {
        font-size: 1rem;
    }
    .mini-banner {
        width: 60px;
        height: 60px;
        object-fit: cover;
    }
</style>
