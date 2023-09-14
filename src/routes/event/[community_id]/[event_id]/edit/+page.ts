import type { PageLoad } from "./$types"

export const load: PageLoad = ({ params }) => {
    return {
        event_id: params.event_id,
        community_id: params.community_id
    }
}

export interface URLVars{
    event_id: string
    community_id: string
}