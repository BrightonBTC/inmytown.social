<script lang="ts">
    import Loading from "$lib/Loading.svelte";
    import type NDK from "@nostr-dev-kit/ndk";
    import type { NDKEvent, NDKUser } from "@nostr-dev-kit/ndk";
    import UserName from "./UserName.svelte";
    import { fetchUser, parseUserStatusData } from "./user";
    import LinkedPfpIcon from "./LinkedPFPIcon.svelte";
    import type {UserStatus} from "./user";
    import Location from "$lib/location/Location.svelte";
    import { onMount } from "svelte";
    import Tags from "$lib/topics/Tags.svelte";

    export let ndk: NDK | undefined;
    export let npub: string | undefined;
    let user: NDKUser | undefined;
    let status: UserStatus | undefined;

    $: lazyLoad(), npub

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

<div class="card mb-3 p-2 user-{npub}">
    {#if user}
    <div class="d-flex">
        <div>
            <LinkedPfpIcon {ndk} npub={user.npub} />
        </div>
        <div>
            <div class="card-body">
                <h5 class="card-title"><UserName {user} /></h5>
                {#if status}
                    {#if status.status && status.status.length > 0}
                    <p><i class="bi bi-quote"></i> {status.status} <i class="bi bi-quote rot180"></i></p>
                    {/if}
                    {#if status.city && status.country}
                    <Location city={status.city} country={status.country} />
                    {/if}
                    {#if status.locationStatus == 'visiting'}
                    <span class="badge bg-secondary">visiting</span>
                    {/if}
                    {#if status.interests && status.interests.length > 0}
                    <div class="mt-3">
                        <Tags tags={status.interests} linked={true} />
                    </div>
                    {/if}
                {/if}
            </div>
        </div>
    </div>
    {:else}
    <Loading />
    {/if}
</div>
<style>
    i{
        font-size: .8rem;
    }
    i::before{
        transform: translateY(-.3rem);
    }
    i.rot180::before{
        transform: rotate(180deg) translateY(.3rem);
    }
</style>