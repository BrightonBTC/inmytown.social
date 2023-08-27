<script lang="ts">
    import type { CommunityMeta } from "$lib/community/community";
    import { marked } from "marked";

    export let communityDetails: CommunityMeta;
</script>
<div class="p-4 border-start">
    {@html marked(communityDetails.content)}
</div>




