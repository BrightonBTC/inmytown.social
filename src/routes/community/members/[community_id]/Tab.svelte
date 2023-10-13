<script lang="ts">
    export let id:string

    let cls = ''
    if(id === 'new') cls = 'show active'
</script>

<div class="tab-pane container fade {cls}" id="{id}">
    <p class="mx-4 lead">
        <slot name="info" />
    </p>
    <slot />
</div>