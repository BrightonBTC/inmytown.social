<script lang="ts">
    import type NDK from "@nostr-dev-kit/ndk";
    import type { NDKEvent, NDKUser } from "@nostr-dev-kit/ndk";
    import UserName from "./UserName.svelte";
    import { fetchUser, parseUserStatusData } from "./user";
    import LinkedPfpIcon from "./LinkedPFPIcon.svelte";
    import type {UserStatus} from "./user";
    import Location from "$lib/location/Location.svelte";

    export let ndk: NDK | undefined;
    export let npub: string | undefined;
    let user: NDKUser | undefined;
    let status: UserStatus | undefined;

    $: setUser(), npub

    async function setUser(){
        if(ndk && npub){
            user = await fetchUser(ndk, npub);
            let hexk = user?.hexpubkey()
            if(hexk){
                const statusSub = ndk.subscribe(
                    {kinds: [10037], authors: [hexk]},
                    { closeOnEose: false }
                );
                statusSub.on("event", (event: NDKEvent) => {
                    status = parseUserStatusData(event)
                });
            }
        } 
    }
</script>
{#if user}
<div class="card mb-3 p-2">
    <div class="d-flex">
        <div>
            <LinkedPfpIcon {ndk} npub={user.npub} />
        </div>
        <div>
            <div class="card-body">
                <h4 class="card-title"><UserName {user} /></h4>
                {#if status}
                    <p>{status.status}</p>
                    <Location city={status.city} country={status.country} />
                    {#if status.locationStatus == 'visiting'}
                    <span class="badge bg-secondary">visiting</span>
                    {/if}
                {/if}
            </div>
        </div>
    </div>
</div>
{/if}