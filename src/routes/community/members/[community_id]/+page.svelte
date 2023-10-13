<script lang="ts">
    import "bootstrap-icons/font/bootstrap-icons.css";
    import type { CommunityID } from "./+page";
    export let data: CommunityID;
    import { onMount } from "svelte";
    import { community } from "./stores";
    import Loading from "$lib/Loading.svelte";
    import { Community } from "$lib/community/community";
    import { login } from "$lib/user/user";
    import ndk from "$lib/stores/ndk";
    import { loggedInUser } from "$lib/stores/user";
    import MainContent from "$lib/MainContent.svelte";
    import CommunityCard from "$lib/community/CommunityCard.svelte";
    import UserRow from "./UserRow.svelte";
    import TabNew from "./TabContent.svelte";
    import Tab from "./Tab.svelte";
    import TabContent from "./TabContent.svelte";
    import TabLink from "./TabLink.svelte";

    let authorised: boolean | undefined;
    let failedFetch: boolean = false;

    onMount(async () => {
        community.set(new Community($ndk));
        await login($ndk);

        fetchCommunity();
    });

    async function fetchCommunity() {
        let success = await $community.fetchMeta(data.community_id);
        if (success) {
            if ($community.meta.author === $loggedInUser?.npub) {
                authorised = true;
                await $community.fetchMembers();
                $community = $community;
            } else {
                authorised = false;
            }
        } else {
            failedFetch = true;
        }
    }
</script>

<MainContent>
    {#if authorised === true}
        {#if $community.meta}
            <div class="row">
                <div class="col-sm-4">
                    <CommunityCard communityDetails={$community.meta} />
                </div>

                <div class="col-sm-8">
                    <h1>Community members</h1>
                    <ul class="nav nav-tabs">

                        <TabLink id="new" title="New requests" users={$community.users.followers} />
                        <TabLink id="approved" title="Approved" users={$community.users.members} />
                        <TabLink id="stale" title="Stale" users={$community.users.stale} />
                        <TabLink id="muted" title="Muted" users={$community.users.blocked} />
                        
                    </ul>

                    <div class="tab-content pt-3">

                        <Tab id="new">
                            <span slot="info">
                                Users in this section have followed your community but have not yet been approved for full membership
                            </span>
                            <TabContent users={$community.users.followers} accessLevel="pending" />
                        </Tab>

                        <Tab id="approved">
                            <span slot="info">
                                Users in this section have been approved. They will be included in
                                the members list on your community page, and any comments they make
                                in the chat box will be visible by default.
                            </span>
                            <TabContent users={$community.users.members} accessLevel="accepted" />
                        </Tab>

                        <Tab id="stale">
                            <span slot="info">
                                These users have been approved but may no longer be following the
                                community.
                            </span>
                            <TabContent users={$community.users.stale} accessLevel="accepted" />
                        </Tab>

                        <Tab id="muted">
                            <span slot="info">
                                These members have been blocked from joining your community. They
                                are still able to follow and comment (that's the open nature of the
                                NOSTR protocol) but any posts will be hidden by default, and any
                                further requests to join will be ignored.
                            </span>
                            <TabContent users={$community.users.blocked} accessLevel="rejected" />
                        </Tab>
                        
                    </div>
                </div>
            </div>
        {/if}
    {:else if failedFetch}
        <div class="alert alert-warning">
            <strong>Warning!</strong> Unable to retrieve community!
        </div>
    {:else if authorised === false}
        <div class="alert alert-warning">
            <strong>Warning!</strong> You are not authorised to modify this community!
        </div>
    {:else}
        <Loading />
    {/if}
</MainContent>
