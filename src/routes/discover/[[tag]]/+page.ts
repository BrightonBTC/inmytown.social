import type { PageLoad } from "./$types"

export const load: PageLoad = ({ params }) => {
    return {
        tag: params.tag
    }
}

export interface Tag{
    tag: string
}
