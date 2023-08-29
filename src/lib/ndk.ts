import { NDKNip07Signer } from "@nostr-dev-kit/ndk";
import NDK from "@nostr-dev-kit/ndk";
import { hasSigner, relays } from "./stores";

const ndk = new NDK({
    explicitRelayUrls: relays,
});
ndk.connect();

if(typeof window !== 'undefined' && window.nostr){
    console.log('HAS SIGNER')
    hasSigner.set(true);
    ndk.signer = new NDKNip07Signer();
}

export default ndk;