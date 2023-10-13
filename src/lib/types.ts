
type LocationStatus = "living" | "visiting"

type City = {
    country: string;
    name: string;
    lat: string;
    lng: string;
}

type loadingState = 'success' | 'loading' | 'failed'

type userAccessLevel = 'pending' | 'accepted' | 'rejected'
type userAccessActions = 'accept' | 'block' | 'unblock' | 'clear'