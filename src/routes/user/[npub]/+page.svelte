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

    type loadingState = 'success' | 'loading' | 'failed'
    let loadingState:loadingState = 'loading'

    let loadingMessage = "Fetching User Profile..."

    $: isLoggedInUser = data.npub === $loggedInUser?.npub

    async function setUser(){
        let user = new MeetupUser({npub: data.npub})
        meetupUser.set(user)
        $meetupUser.ndk = $ndk
        // set profile from data we received on the server
        if(data.profile){
            $meetupUser.profile = data.profile
            loadingState = 'success'
        } 
        // request profile again based on client side relay settings
        fetchProfile()
    }

    async function fetchProfile(){
        // create a temp user obj so we don't overwrite $meetupUser unless we want to
        let user = new MeetupUser({npub: data.npub})
        user.ndk = $ndk
        await user.fetchProfile()
        if(user.hasProfile()){
            if(!$meetupUser.hasProfile() || user.profileCreatedAt() > $meetupUser.profileCreatedAt()){
                $meetupUser.profile = user.profile
            }
            loadingState = 'success'
        } 
        else loadingState = 'failed'
    }

    function setPage(p:string){
        page = p
    }

    $: loadingState = 'loading', setUser(), setPage('status'), data.npub

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
{#if loadingState === 'success'}
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
{:else if loadingState === 'loading'}
    <Loading t={loadingMessage} />
{:else if loadingState === 'failed'}
    <div class="alert alert-warning">
        Failed to locate profile for this user
    </div>
{/if}
