<script lang="ts">
    import Location from "$lib/location/Location.svelte";;
    import Tags from "$lib/topics/Tags.svelte";
    import UserName from "$lib/user/UserName.svelte";
    import StatusEdit from "./StatusEdit.svelte";
    import { editStatus, meetupUser } from "./stores";

    export let isLoggedInUser: boolean;

</script>
{#if isLoggedInUser && !$editStatus}
    <button class="btn btn-success mb-5" on:click={() => {$editStatus = true}}>Edit Status <i class="bi bi-pencil-fill"></i></button>
{:else if isLoggedInUser}
    <StatusEdit />
{/if}
{#if !$editStatus }
    {#if $meetupUser.status}
    <div class="bg-dark text-light rounded">
        
        <p class="text-muted"><small>Current status:</small></p>
        {#if $meetupUser.status.status && $meetupUser.status.status.trim().length > 0}
            <blockquote class="blockquote">
                <p>{$meetupUser.status.status}</p>
            </blockquote>
        {:else}
            <p class="text-muted"><em><small>-- Not set --</small></em></p>
        {/if}
        <p class="text-muted"><small>Current location:</small></p>
        {#if $meetupUser.status.city && $meetupUser.status.country && $meetupUser.status.locationStatus}
            <p>
                <Location city={$meetupUser.status.city} country={$meetupUser.status.country} />
                {#if $meetupUser.status.locationStatus == 'visiting'}
                    <span class="badge bg-secondary">visiting</span>
                {/if}
            </p>
        <!-- {statusData.locationStatus} @ {statusData.city}, {statusData.country}  -->
        {:else}
        <p class="text-muted"><em><small>-- Not set --</small></em></p>
        {/if}
        <p class="text-muted"><small>Interests:</small></p>
        <div class="mb-3">
            <Tags tags={$meetupUser.status.interests} linked={true} />
        </div>
    </div>
    {:else}
    <p><UserName user={$meetupUser} /> has not set a status or location yet</p>
    {/if}
{/if}
