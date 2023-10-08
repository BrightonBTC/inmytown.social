<script lang="ts">
    import Status from "./Status.svelte";
    import MemberList from "./MemberList.svelte";
    import AdminOfList from "./AdminOfList.svelte";
    import { MeetupUser} from "$lib/user/user";
    import Follows from "./Follows.svelte";
    import { meetupUser } from "./stores";
    import Loading from "$lib/Loading.svelte";
    import ndk from "$lib/stores/ndk";
    import { loggedInUser } from "$lib/stores/user";
    import MetaTags from "$lib/MetaTags.svelte";
    import UserCard from "$lib/user/UserCard.svelte";

    export let data

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

    $: loadingState = 'loading', setUser(), data.page, data.npub

    function isActivePage(p:string | undefined){
        if (p === data.page) return 'active'
        return ''
    }
</script>

<MetaTags 
    title="{data.profile?.displayName ||
        data.profile?.name ||
        data.profile?.nip05 ||
        data.npub} | User Profile @ InMyTown"
    description={data.profile?.about}
    url="/user/{data.npub}"
    image={data.profile?.image}
    type="user-banner"
/>
{#if loadingState === 'success'}
    <div class="row">
        <div class="col-lg-4 mb-3 rounded">
            <UserCard user={$meetupUser} />
        </div>
        <div class="col-lg-8 pb-4">
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link {isActivePage(undefined)}" href="/user/{$meetupUser.npub}/">Location Status</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link {isActivePage('communities')}" href="/user/{$meetupUser.npub}/communities">Communities</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link {isActivePage('follows')}" href="/user/{$meetupUser.npub}/follows">Follows</a>
                </li>
            </ul>
            <div class="p-3 mt-3 rounded content-holder">
                {#if data.page==='communities'}
                <AdminOfList {isLoggedInUser} />
                <MemberList />
                {:else if data.page==='follows'}
                <Follows />
                {:else}
                <Status {isLoggedInUser} />
                {/if}
            </div>
        </div>
    </div>
{:else if loadingState === 'loading'}
    <Loading t={loadingMessage} />
{:else if loadingState === 'failed'}
    <div class="alert alert-warning">
        Failed to locate profile for this user
    </div>
{/if}
<style>
    .row, .content-holder{
        min-height: 100vh;
    }
    .content-holder{
        background: linear-gradient(180deg, rgba(var(--bs-secondary-rgb),.3), transparent, transparent);
    }
</style>