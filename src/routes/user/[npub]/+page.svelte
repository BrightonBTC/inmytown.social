<script lang="ts">
    import type { User } from "./proxy+page";
    import { onMount } from "svelte";
    import type NDK from "@nostr-dev-kit/ndk";
    import { loadNDK } from "$lib/nostr";
    import { userNpub, userStatus } from "$lib/stores";
    import Status from "./Status.svelte";
    import MemberList from "./MemberList.svelte";
    import AdminOfList from "./AdminOfList.svelte";
    import Header from "./Header.svelte";
    import { NDKUser } from "@nostr-dev-kit/ndk";
    import { fetchFollows, subUserStatus, type UserStatus } from "$lib/user/user";
    import Follows from "./Follows.svelte";
    import { currentUserFollows } from "./stores";
    import Del from "./Del.svelte";
    import Loading from "$lib/Loading.svelte";
    export let data:User;   
    let ndk: NDK | undefined; 
    let page: string = 'status'

    let statusData: UserStatus;

    $: npub = data.npub;
    $: isLoggedInUser = data.npub === $userNpub

    onMount(async () => {
        ndk = await loadNDK();
        getUserStatusData()
        getLoggedInUserFollows()
    });
    function setPage(p:string){
        page = p
    }

    $: getUserStatusData(), setPage('status'), getLoggedInUserFollows(), npub
 
    async function getUserStatusData(){
        statusData = {
            communities: [],
            interests: []
        }
        if (ndk) {
            console.log('getUserStatusData')
            let user = new NDKUser({npub: npub})
            subUserStatus(ndk, user.hexpubkey(), (data) => {
                console.log('statusData',data)
                statusData = data
                if(isLoggedInUser && statusData){
                    userStatus.set(JSON.stringify(statusData))
                }
            })
        } 
    }

    async function getLoggedInUserFollows() {
        if(!ndk || !$userNpub) return;
        $currentUserFollows = await fetchFollows(ndk, $userNpub)
    }

</script>
{#if ndk}
    <Header  {npub} {ndk} />
    <div class="row">
        <div class="col-lg-3">
            <div class="mt-3 p-3 border-end">
                <div class="list-group mt-2 list-group-flush">
                    <a href="#t" class="list-group-item list-group-item-action" on:click|preventDefault={() => setPage('status')}>Status</a>
                    <a href="#t" class="list-group-item list-group-item-action" on:click|preventDefault={() => setPage('admin')}>Communities (admin)</a>
                    <a href="#t" class="list-group-item list-group-item-action" on:click|preventDefault={() => setPage('member')}>Communities (member)</a>
                    <a href="#t" class="list-group-item list-group-item-action" on:click|preventDefault={() => setPage('follows')}>Follows</a>
                </div>
            </div>
            
        </div>
        <div class="col-lg-9 p-4">
            {#if page==='admin'}
            <AdminOfList {ndk} {npub} {isLoggedInUser} />
            {:else if page==='member'}
            <MemberList {ndk} {statusData} />
            {:else if page==='status'}
            <Status {ndk} {statusData} {isLoggedInUser} />
            {:else if page==='follows'}
            <Follows {ndk} {npub} />
            {:else if page==='del'}
            <Del {ndk} {npub} />
            {/if}
        </div>
    </div>
{:else}
<Loading />
{/if}
