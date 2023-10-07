<script lang="ts">
    import Loading from "$lib/Loading.svelte";
    import type { NDKEvent, NDKUser } from "@nostr-dev-kit/ndk";
    import UserName from "./UserName.svelte";
    import { MeetupUser, fetchUser } from "./user";
    import LinkedPfpIcon from "./LinkedPFPIcon.svelte";
    import type {UserStatus} from "./user";
    import Location from "$lib/location/Location.svelte";
    import { onMount } from "svelte";
    import Tags from "$lib/topics/Tags.svelte";
    import LocationStatus from "$lib/user/LocationStatus.svelte";
    import ndk from "$lib/stores/ndk";

    export let npub: string;
    let user: NDKUser | undefined;
    let status: UserStatus | undefined;

    async function setUser(){
        user = await fetchUser($ndk, npub);
            let hexk = user?.hexpubkey()
            if(hexk){
                const statusSub = $ndk.subscribe(
                    {kinds: [10037], authors: [hexk]}
                );
                statusSub.on("event", (event: NDKEvent) => {
                    if(!status || status.created && event.created_at && status.created < event.created_at){
                        status = MeetupUser.parseStatus(event)
                    }
                });
            }
    }

    function lazyLoad() {
        let item = document.querySelector(".user-"+npub);
        if("IntersectionObserver" in window && item) {
            lazyloadIntersectionObserver(item);
        } 
    }
    function lazyloadIntersectionObserver(item: Element) {
        let itemObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if(entry.isIntersecting) {
                    setUser()
                    itemObserver.unobserve(entry.target);
                }
            });
        });
        itemObserver.observe(item);
    }
    onMount(() => {
        lazyLoad()
    })
</script>

<div class="card mb-2 user-{npub}">
    {#if user}
    <div class="d-flex card-body p-2 align-items-center" style="gap:15px">
        <div>
            <LinkedPfpIcon npub={user.npub} />
        </div>
        <h5 class="card-title mb-0"><UserName {user} /></h5>
        <small><LocationStatus status={status?.status} /></small>
        
        {#if status && status.city && status.country}
            <div class="loc me-2">
                <Location city={status.city} country={status.country} />
            </div> 
        {/if}
    </div>
    {#if status && status.interests && status.interests.length > 0}
        <div class="mt-1 small card-footer bg-dark">
            <Tags tags={status.interests} linked={true} />
        </div>
    {/if}
    {:else}
    <Loading />
    {/if}
</div>
<style>
    .loc{
        margin-left: auto;
    }
</style>