<script lang="ts">
    import { goto } from "$app/navigation";
    import { CommunityMetaDefaults, type CommunityMeta, publishCommunityMeta } from "$lib/community/community";
    import { searchCity, searchCountry } from "$lib/stores";
    import type NDK from "@nostr-dev-kit/ndk";
    import { NDKEvent } from "@nostr-dev-kit/ndk";

    export let ndk: NDK | undefined;
    let newCommunityName: string;
    let nameLen = 0;
    $: nameLen = newCommunityName ? newCommunityName.length: 0;

    
    async function submitCommunity() {
        if (!ndk) return;
        if (nameLen < 3) return;
        
        const ndkEvent = new NDKEvent(ndk);
        ndkEvent.kind = 1037;
        ndkEvent.content = newCommunityName;
        await ndkEvent.publish();

        let communityMeta: CommunityMeta = {
            ...CommunityMetaDefaults,
            eid: ndkEvent.id,
            uid: Math.round(Date.now()).toString(16),
            title: newCommunityName,
        };
        if ($searchCountry) {
            communityMeta.country = $searchCountry;
        }
        if ($searchCity) {
            communityMeta.city = $searchCity;
        }
        communityMeta = await publishCommunityMeta(ndk, communityMeta);
        if(!communityMeta.error)
            goto("/community/edit/" + ndkEvent.id);
    }
</script>

<div class="modal" id="addCommunityModal">
    <div class="modal-dialog modal-dialog-centered">
        <form
            class="modal-content"
            on:submit|preventDefault={submitCommunity}
        >
            <!-- Modal Header -->
            <div class="modal-header">
                <h4 class="modal-title">Create a new community</h4>

                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                />
            </div>

            <!-- Modal body -->
            <div class="modal-body">
                <input
                    type="name"
                    class="form-control"
                    id="name"
                    placeholder="eg. My local meetup"
                    name="name"
                    maxlength="50"
                    bind:value={newCommunityName}
                />
            </div>
            <div class="modal-footer">

                {#if nameLen < 3}
                <button
                    type="submit"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                    disabled
                >Create now</button>
                {:else}
                <button
                    type="submit"
                    class="btn btn-primary"
                    data-bs-dismiss="modal"
                >Create now</button>
                {/if}
                
            </div>
        </form>
    </div>
</div>