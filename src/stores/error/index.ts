import { writable } from "svelte/store";

export const currentError = writable<number>(null);