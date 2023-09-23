<script lang="ts">
    import Status from "./Status.svelte";
    import MemberList from "./MemberList.svelte";
    import AdminOfList from "./AdminOfList.svelte";
    import Header from "./Header.svelte";
    import { MeetupUser} from "$lib/user/user";
    import Follows from "./Follows.svelte";
    import { meetupUser } from "./stores";
    import Loading from "$lib/Loading.svelte";
    import ndk from "$lib/ndk";
    import { loggedInUser } from "$lib/stores/user";
    import MetaTags from "$lib/MetaTags.svelte";

    export let data;

    let page: string = 'status'
    let loaded:boolean

    let loadingMessage = "Fetching User Profile..."

    $: isLoggedInUser = data.npub === $loggedInUser?.npub

    async function setUser(){
        let user = new MeetupUser({npub: data.npub})
        user.profile = data.profile
        user.ndk = $ndk
        meetupUser.set(user)
        loadingMessage = "Fetching User Status..."
        await $meetupUser.fetchStatus()
        loaded = true;
    }

    function setPage(p:string){
        page = p
    }

    $: loaded = false, setUser(), setPage('status'), data.npub

</script>

<MetaTags 
    title="{data.profile?.displayName ||
        data.profile?.name ||
        data.profile?.nip05 ||
        data.npub} | User Profile @ InMyTown"
    description={data.profile?.about}
    url="/user/{data.npub}"
    image={data.profile?.image}
/>

{#if loaded}
    <Header />
    <div class="row">
        <div class="col-lg-3">
            <div class="mt-3 p-3 border-end">
                <div class="list-group mt-2 list-group-flush">
                    <a href="#t" class="list-group-item list-group-item-action" on:click|preventDefault={() => setPage('status')}>Status & Location</a>
                    <a href="#t" class="list-group-item list-group-item-action" on:click|preventDefault={() => setPage('admin')}>Communities (admin)</a>
                    <a href="#t" class="list-group-item list-group-item-action" on:click|preventDefault={() => setPage('member')}>Communities (member)</a>
                    <a href="#t" class="list-group-item list-group-item-action" on:click|preventDefault={() => setPage('follows')}>Follows</a>
                </div>
            </div>
            
        </div>
        <div class="col-lg-9 p-4">
            {#if page==='admin'}
            <AdminOfList {isLoggedInUser} />
            {:else if page==='member'}
            <MemberList />
            {:else if page==='status'}
            <Status {isLoggedInUser} />
            {:else if page==='follows'}
            <Follows />
            {/if}
        </div>
    </div>
{:else}
<Loading t={loadingMessage} />
{/if}
