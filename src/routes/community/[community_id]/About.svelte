<script lang="ts">
    import { marked } from "marked";
    import {community} from "./stores/store.community";
</script>

<div class="p-4 border-start">
    {@html marked($community.meta.content)}
</div>




