import type { PageLoad } from "./$types"

export const load: PageLoad = ({ params }) => {
    return {
        event_id: params.event_id
    }
}

export interface MeetupEventID{
    event_id: string
}