<script lang="ts">
    import LinkedPfpIcon from "$lib/user/LinkedPFPIcon.svelte";
    import { attendees, interested } from "./stores";
</script>

<ul class="list-group list-group-flush mt-3">
    {#if Object.values($attendees).length > 0}
        <li class="list-group-item">
            <div class="text-muted">
                Going ({Object.values($attendees).length})
            </div>
            {#each Object.values($attendees) as a}
                <div class="p-1 float-start">
                    <LinkedPfpIcon npub={a[0]} />
                </div>
            {/each}
        </li>
    {/if}

    {#if Object.values($interested).length > 0}
        <li class="list-group-item">
            <div class="text-muted">
                Interested ({Object.values($interested).length})
            </div>
            {#each Object.values($interested) as a}
                <div class="p-1 float-start">
                    <LinkedPfpIcon npub={a[0]} />
                </div>
            {/each}
        </li>
    {/if}
</ul>