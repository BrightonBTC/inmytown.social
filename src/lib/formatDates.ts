import { format, fromUnixTime, isValid } from "date-fns";

export function dateStringFull(ts: number){
    if(!isValid(ts) || ts < 1 ) return '';
    return format(
        fromUnixTime(ts),
        "MMM do, y, h:mmaaa"
    )
}

export function dateStatusString(starts: number, ends: number){
    let now = Date.now() / 1000;
    if(ends < (now)) return '<span class="badge bg-warning text-dark">ended</span>';
    else if (ends > (now) && starts < (now)) return '<span class="badge bg-success">happening now</span>';
    else return ''
}