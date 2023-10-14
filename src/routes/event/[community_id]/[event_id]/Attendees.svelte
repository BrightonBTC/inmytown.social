<script lang="ts">
    import LinkedPfpIcon from "$lib/user/LinkedPFPIcon.svelte";
    import { attendees, community, interested } from "./stores";

    interface attendeeList{
        members: [string, string][],
        others: [string, string][]
    }

    let attendeesGrouped:attendeeList = {
        members: [],
        others: []
    }

    let interestedGrouped:attendeeList = {
        members: [],
        others: []
    }

    $: groupUsers(), $interested, $attendees, $community

    async function groupUsers() {
        attendeesGrouped = {
            members: $attendees.filter(x => $community.users.members?.includes(x[0])),
            others: $attendees.filter(x => !$community.users.members?.includes(x[0]))
        }
        interestedGrouped = {
            members: $interested.filter(x => $community.users.members?.includes(x[0])),
            others: $interested.filter(x => !$community.users.members?.includes(x[0]))
        }
    }

    
</script>

<ul class="list-group list-group-flush mt-3">
    
    {#if Object.values($attendees).length > 0}
        <li class="list-group-item">
            <div class="text-light">
                Going
            </div>
            <div class="text-muted small">
                {Object.values(attendeesGrouped.members).length} members + {Object.values(attendeesGrouped.others).length} others
            </div>
            {#each Object.values(attendeesGrouped.members) as a}
                <div class="p-1 float-start">
                    <LinkedPfpIcon npub={a[0]} />
                </div>
            {/each}
            {#each Object.values(attendeesGrouped.others) as a}
                <div class="p-1 float-start">
                    <LinkedPfpIcon npub={a[0]} />
                </div>
            {/each}
        </li>
    {/if}

    {#if Object.values($interested).length > 0}
        <li class="list-group-item">
            <div class="text-light">
                Interested 
            </div>

            <div class="text-muted small">
                {Object.values(interestedGrouped.members).length} members + {Object.values(interestedGrouped.others).length} others
            </div>
            {#each Object.values(interestedGrouped.members) as a}
                <div class="p-1 float-start">
                    <LinkedPfpIcon npub={a[0]} />
                </div>
            {/each}
            {#each Object.values(interestedGrouped.others) as a}
                <div class="p-1 float-start">
                    <LinkedPfpIcon npub={a[0]} />
                </div>
            {/each}
        </li>
    {/if}
</ul>