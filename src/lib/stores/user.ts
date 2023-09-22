import type { NDKUser } from "@nostr-dev-kit/ndk";
import { writable } from "svelte/store";

export const loggedInUser = writable<NDKUser | undefined>(undefined);