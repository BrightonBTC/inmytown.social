<script lang="ts">
    export let isLoggedInUser: boolean;

    import Location from "$lib/location/Location.svelte";
    import LocationSelect from "$lib/location/LocationSelect.svelte";
    import { userStatus } from "$lib/stores";
    import TagSelector from "$lib/topics/TagSelector.svelte";
    import Tags from "$lib/topics/Tags.svelte";
    import { publishUserStatus, type UserStatus } from "$lib/user/user";
    import type NDK from "@nostr-dev-kit/ndk";

    export let ndk: NDK;
    export let statusData: UserStatus;

    let edit: boolean = false;

    let showStatus: boolean = statusData.city && statusData.country && statusData.locationStatus ? true : false;

    async function submitStatus(){
        if(ndk){
            if(!showStatus){
                statusData.city, statusData.country, statusData.locationStatus = undefined;
            }
            let r = await publishUserStatus(ndk, statusData);
            userStatus.set(JSON.stringify(statusData));
            edit = false
        }
    }

    function locChanged(city: City){
        statusData.city = city.name
        statusData.country = city.country
    }

    function updateTags(tags: string[]){
        statusData.interests = tags
    }
</script>
{#if isLoggedInUser && !edit}
    <button class="btn btn-success mb-5" on:click={() => {edit = true}}>Edit Status <i class="bi bi-pencil-fill"></i></button>
{:else if isLoggedInUser}
    <form on:submit|preventDefault={submitStatus}>
        <div class="mb-3 mt-3">
            <label for="status" class="form-label">Status:</label>
            <input
                type="status"
                class="form-control"
                maxlength="100"
                placeholder="eg. visiting London"
                name="status"
                bind:value={statusData.status}
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
            <Tags tags={statusData.interests} linked={false} />
            <TagSelector callback={updateTags} tags={statusData.interests} />
        </div>
        <div class="mb-3">
            <label for="locationStatus" class="form-label">Current location:</label>
            <div class="d-flex align-items-center">
                <div>
                    <select
                        class="form-select"
                        id="locationStatus"
                        bind:value={statusData.locationStatus}
                    >
                        <option value="living">Living in</option>
                        <option value="visiting">Visiting</option>
                    </select>
                </div>
                
                <div class="ps-2">
                    <LocationSelect country={statusData.country} city={statusData.city} callback={locChanged} />
                </div>
                
            </div>
            
        </div>
        {/if}
        <button type="submit" class="btn btn-primary">Save Changes</button> 
        <button type="submit" class="btn btn-secondary"  on:click|preventDefault={() => {edit = false}}>Cancel</button>
    </form>
{/if}
{#if !edit}
<div class="bg-dark text-light rounded">
    
    <p class="text-muted"><small>Current status:</small></p>
    {#if statusData.status && statusData.status.trim().length > 0}
        <blockquote class="blockquote">
            <p>{statusData.status}</p>
        </blockquote>
    {:else}
        <p class="text-muted"><em><small>-- Not set --</small></em></p>
    {/if}
    <p class="text-muted"><small>Current location:</small></p>
    {#if statusData.city && statusData.country && statusData.locationStatus}
        <p>
            <Location city={statusData.city} country={statusData.country} />
            {#if statusData.locationStatus == 'visiting'}
                <span class="badge bg-secondary">visiting</span>
            {/if}
        </p>
    <!-- {statusData.locationStatus} @ {statusData.city}, {statusData.country}  -->
    {:else}
    <p class="text-muted"><em><small>-- Not set --</small></em></p>
    {/if}
    <p class="text-muted"><small>Interests:</small></p>
    <div class="mb-3">
        <Tags tags={statusData.interests} linked={true} />
    </div>
</div>
{/if}
