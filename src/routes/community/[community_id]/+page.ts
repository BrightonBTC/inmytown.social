import type { PageLoad } from "../../user/$types"


export const load: PageLoad = ({ params }) => {
    return {
        community_id: params.community_id
    }
}

export interface Community{
    community_id: string
}