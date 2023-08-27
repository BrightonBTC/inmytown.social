import countries from "$lib/countries.json";

export function validateCity(city:string | undefined){
    if(city){
        let c = city.split(' ')
        if(c.length > 1 && countries.ref_country_codes.filter((x) => x.alpha2 == c[1]).length > 0){
            return true;
        }
    }
    return false;
}