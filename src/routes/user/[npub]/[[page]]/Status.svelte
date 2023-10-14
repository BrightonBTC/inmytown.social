<script lang="ts">
    import Location from "$lib/location/Location.svelte";;
    import Tags from "$lib/topics/Tags.svelte";
    import UserName from "$lib/user/UserName.svelte";
    import { onMount } from "svelte";
    import StatusEdit from "./StatusEdit.svelte";
    import { editStatus, meetupUser } from "./stores";
    import Loading from "$lib/Loading.svelte";
    import LocationStatus from "$lib/user/LocationStatus.svelte";

    export let isLoggedInUser: boolean
    let ready:boolean = false

    onMount(async () => {
        await $meetupUser.fetchStatus()
        $meetupUser = $meetupUser
        ready = true
    })

</script>

{#if !$editStatus }
    {#if $meetupUser.status}
    <div class="bg-dark text-light card">
        <div class="card-body">
            <p class="text-muted"><small>Location status:</small></p>
            {#if $meetupUser.status.status && $meetupUser.status.status.trim().length > 0}
                <blockquote class="blockquote">
                    <LocationStatus status={$meetupUser.status.status} />
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
            {:else}
            <p class="text-muted"><em><small>-- Not set --</small></em></p>
            {/if}
        </div>
        
        <div class="card-footer">
            <Tags tags={$meetupUser.status.interests} linked={true} />
        </div>
    </div>
    {:else if ready}
        <p><UserName user={$meetupUser} /> has not set a status or location yet</p>
    {:else}
        <Loading t="Fetching user status" />
    {/if}
{/if}
{#if isLoggedInUser}
    <StatusEdit />
{/if}