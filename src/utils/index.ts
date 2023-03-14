import { AxiosError } from 'axios';
import { notifyError } from './toast';

export class HandledError extends Error {
	cause: Error;

	constructor(message: string, cause: Error) {
		super(message);
		this.cause = cause;
		this.name = 'HandledError';
	}
}

export class ErrNotificationError extends HandledError {
	constructor(message: string, cause: Error) {
		super(message, cause);

		notifyError(message);
	}
}

export function handleErrActionRejected(
	err: Error & { code?: string },
	message = 'Action was rejected by user.',
) {
	if (err.code === 'ACTION_REJECTED') {
		notifyError(message);

		throw new HandledError(message, err);
	}
}

export function isAxiosNetworkError(err: Error) {
	return err instanceof AxiosError && err.code === 'ERR_NETWORK';
}

export function handleAxiosNetworkError(err: Error) {
	if (isAxiosNetworkError(err)) {
		notifyError('Network error. Please check your internet connection.');

		throw new HandledError('Network error.', err);
	}
}

export function handleGenerativeName(nftName: string, collectionName: string) {
	const re = /^#\d+$/;

	if (nftName.match(re)) {
		return collectionName + ': ' + nftName;
	}

	return nftName;
}
