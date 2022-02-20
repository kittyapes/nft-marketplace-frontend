import { derived, writable } from 'svelte/store';

export enum WalletState {
	UNKNOWN = 'UNKNOWN',
	CONNECTED = 'CONNECTED',
	DISCONNECTED = 'DISCONNECTED'
}

export const walletState = writable<WalletState>(WalletState.UNKNOWN);

// Stores for nice if statements ;)
export const walletUnknown = derived(walletState, (state) => state === WalletState.UNKNOWN);
export const walletConnected = derived(walletState, (state) => state === WalletState.CONNECTED);
export const walletDisconnected = derived(
	walletState,
	(state) => state === WalletState.DISCONNECTED
);
export const walletRefreshed = derived(
	walletState,
	(state) => state === WalletState.CONNECTED || state === WalletState.DISCONNECTED
);
