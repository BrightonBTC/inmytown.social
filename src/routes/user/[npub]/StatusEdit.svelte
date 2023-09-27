<script lang="ts">
    import LocationSelect from "$lib/location/LocationSelect.svelte";
    import ndk from "$lib/stores/ndk";
    import TagSelector from "$lib/topics/TagSelector.svelte";
    import Tags from "$lib/topics/Tags.svelte";
    import { publishUserStatus } from "$lib/user/user";
    import { editStatus, meetupUser } from "./stores";


    if(!$meetupUser.status){
        $meetupUser.status = {
            communities: [],
            interests: [],
            status: undefined,
            locationStatus: undefined,
            country: undefined,
            city: undefined,
            created: -1
        }
    }

    let showStatus: boolean = $meetupUser.status?.city && $meetupUser.status?.country && $meetupUser.status?.locationStatus ? true : false;

    async function submitStatus(){
        if(!$meetupUser.status) return
        if(!showStatus){
            $meetupUser.status.city, $meetupUser.status.country, $meetupUser.status.locationStatus = undefined;
        }
        await publishUserStatus($ndk, $meetupUser.status);
        $editStatus = false
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
{#if !$editStatus}
<button class="btn btn-success mb-5" on:click={() => {$editStatus = true}}>Edit Location Status <i class="bi bi-pencil-fill"></i></button>
{:else}
    {#if $meetupUser.status}
    <form on:submit|preventDefault={submitStatus}>
        <div class="mb-3 mt-3">
            <label for="status" class="form-label">Location Status:</label>
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
        <button type="submit" class="btn btn-secondary"  on:click|preventDefault={() => {$editStatus = false}}>Cancel</button>
    </form>
    {/if}
{/if}