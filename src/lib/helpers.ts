export function imgUrlOrDefault(img: string | undefined, type?: string, domain?: string) {
	if (!img || img.length < 1){
        
        switch(type){
            case 'community':
                img = '/img/default-community.jpg'
            break;
            case 'event':
                img = '/img/default-event.jpg'
            break;
            case 'user':
                img = '/img/default-user.png'
            break;
            case 'user-banner':
                img = '/img/default-user-banner.jpg'
            break;
            default:
                img = '/img/default.jpeg';
            break;
        }
        if(domain) img = domain+img
    }
	return img;
}

export function isValidUrl(value: string | undefined) {
	if (!value) return false;
	try {
		const url = new URL(value);
		if (url.hostname && ['http:', 'https:'].includes(url.protocol)) return url;
		else return false
	} catch (TypeError) {
		return false;
	}
}

export function getBadgeClassByStatus(status:string){
    let badgeClass: string = '';
    switch(status){
        case 'draft':
            badgeClass = 'bg-secondary';
        break;
        case 'published':
            badgeClass = 'bg-success';
        break;
        case 'cancelled':
            badgeClass = 'bg-danger';
        break;
    }
    return badgeClass;
}