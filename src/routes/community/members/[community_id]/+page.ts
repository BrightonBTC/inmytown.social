import type { PageLoad } from "./$types"


export const load: PageLoad = ({ params }) => {
    return {
        community_id: params.community_id
    }
}

export interface CommunityID{
    community_id: string
}