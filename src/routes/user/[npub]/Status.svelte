<script lang="ts">
    export let isLoggedInUser: boolean;

    import Location from "$lib/location/Location.svelte";
    import LocationSelect from "$lib/location/LocationSelect.svelte";
    import ndk from "$lib/ndk";
    import { userStatus } from "$lib/stores";
    import TagSelector from "$lib/topics/TagSelector.svelte";
    import Tags from "$lib/topics/Tags.svelte";
    import { publishUserStatus, type UserStatus } from "$lib/user/user";
    import { meetupUser } from "./stores";


    let edit: boolean = false;

    let showStatus: boolean = $meetupUser.status?.city && $meetupUser.status?.country && $meetupUser.status?.locationStatus ? true : false;

    async function submitStatus(){
        if(!$meetupUser.status) return
        if(!showStatus){
            $meetupUser.status.city, $meetupUser.status.country, $meetupUser.status.locationStatus = undefined;
        }
        let r = await publishUserStatus(ndk, $meetupUser.status);
        userStatus.set(JSON.stringify($meetupUser.status));
        edit = false
    }

    function locChanged(city: City){
        if($meetupUser.status){
            $meetupUser.status.city = city.name
            $meetupUser.status.country = city.country
        }
    }

    function updateTags(tags: string[]){
        if($meetupUser.status){
            $meetupUser.status.interests = tags
        }
    }
</script>
{#if isLoggedInUser && !edit}
    <button class="btn btn-success mb-5" on:click={() => {edit = true}}>Edit Status <i class="bi bi-pencil-fill"></i></button>
{:else if isLoggedInUser && $meetupUser.status}
    <form on:submit|preventDefault={submitStatus}>
        <div class="mb-3 mt-3">
            <label for="status" class="form-label">Status:</label>
            <input
                type="status"
                class="form-control"
                maxlength="100"
                placeholder="eg. visiting London"
                name="status"
                bind:value={$meetupUser.status.status}
            />
        </div>
        <div class="form-check mb-3">
            <label class="form-check-label">
                <input
                    class="form-check-input"
                    type="checkbox"
                    name="remember"
                    bind:checked={showStatus}
                /> Show my profile in location search results.
            </label>
        </div>
        
        {#if showStatus}
        <div class="mb-3 d-flex">
            <label for="tags" class="form-label">Interests:</label>
            <Tags tags={$meetupUser.status.interests} linked={false} />
            <TagSelector callback={updateTags} tags={$meetupUser.status.interests} />
        </div>
        <div class="mb-3">
            <label for="locationStatus" class="form-label">Current location:</label>
            <div class="d-flex align-items-center">
                <div>
                    <select
                        class="form-select"
                        id="locationStatus"
                        bind:value={$meetupUser.status.locationStatus}
                    >
                        <option value="living">Living in</option>
                        <option value="visiting">Visiting</option>
                    </select>
                </div>
                
                <div class="ps-2">
                    <LocationSelect country={$meetupUser.status.country} city={$meetupUser.status.city} callback={locChanged} />
                </div>
                
            </div>
            
        </div>
        {/if}
        <button type="submit" class="btn btn-primary">Save Changes</button> 
        <button type="submit" class="btn btn-secondary"  on:click|preventDefault={() => {edit = false}}>Cancel</button>
    </form>
{/if}
{#if !edit  && $meetupUser.status}
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
{/if}
