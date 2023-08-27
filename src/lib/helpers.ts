export function imgUrlOrDefault(img: string | undefined) {
	if (img && img.length > 0) return img;
	return '/img/default.jpeg';
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