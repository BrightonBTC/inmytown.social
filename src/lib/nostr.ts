import { NDKEvent, NDKNip07Signer } from "@nostr-dev-kit/ndk";
import NDK from "@nostr-dev-kit/ndk";
import { hasSigner, relays } from "./stores";


export async function loadNDK(){
    const ndk = new NDK({
        explicitRelayUrls: relays,
    });
    ndk.connect();

    if(window.nostr){
        console.log('HAS SIGNER')
        hasSigner.set(true);
        ndk.signer = new NDKNip07Signer();
    }

    return ndk;
}


export async function deleteEvent(ndk: NDK, id: string){
    const ndkEvent = new NDKEvent(ndk);
    ndkEvent.kind = 5;
    ndkEvent.tags = [
        ["e", id]
    ];
    await ndkEvent.publish();
}


