import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
    return {
        npub: params.npub
    }
}

export interface UserID{
    npub: string
}
