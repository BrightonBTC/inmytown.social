import { writable } from 'svelte/store';
import NDK, { NDKNip07Signer } from '@nostr-dev-kit/ndk';
import { relays } from './stores/persistent';
import { browser } from '$app/environment';

const ndk = new NDK({
    explicitRelayUrls: relays,
    debug: false
});

if(browser){
    if(window.nostr){
        console.log('HAS SIGNER')
        ndk.signer = new NDKNip07Signer();
    }
}

ndk.connect()
.then(() => console.log('NDK Connected'))
.catch((e) => {
    console.log('NDK Connection Error: '+e)
    ndk.pool.relays.forEach(function(r){
        console.log(r.url, r.status, r.connectionStats) 
    })
    
})

const ndkStore = writable(ndk);

export default ndkStore;