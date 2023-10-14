<script lang="ts">
    import LoadingMini from "$lib/LoadingMini.svelte";

    export let id:string
    export let title:string
    export let users:string[] | undefined

    let cls = ''
    if(id === 'new') cls = 'active'

</script>

<li class="nav-item">
    <a class="nav-link {cls}" data-bs-toggle="tab" href="#{id}"> 
        {title}
        {#if users}
            {#if users.length > 0}
                <span class="badge small bg-dark rounded-pill"
                    >{users.length}</span>
            {/if}
        {:else}
        <LoadingMini />
        {/if}
    </a>
</li>