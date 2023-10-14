import type { MeetupUser } from "$lib/user/user";
import { writable } from "svelte/store";

export const loggedInUser = writable<MeetupUser | undefined>(undefined);