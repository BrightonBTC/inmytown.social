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
        //hasSigner.set(true);
        ndk.signer = new NDKNip07Signer();
    }
}

ndk.connect().then(() => console.log('NDK Connected'))

const ndkStore = writable(ndk);

export default ndkStore;