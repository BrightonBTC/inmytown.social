import NDK, { NDKEvent } from "@nostr-dev-kit/ndk";

export async function deleteEvent(ndk: NDK, id: string): Promise<void>{
    const ndkEvent = new NDKEvent(ndk);
    ndkEvent.kind = 5;
    ndkEvent.tags = [
        ["e", id]
    ];
    await ndkEvent.publish();
    await Promise.resolve()
}


