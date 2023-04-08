import { AxiosError } from 'axios';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { notifyError } from './toast';

import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

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

/**
 * @param nftName
 * @param collectionName
 * @returns `"<collectionName>: <nftName>"` if `nftName` is a sequence of digits or a sequence of digits starting with a #,
 * otherwise returns `nftName`.
 */
export function handleGenerativeName(nftName: string, collectionName: string) {
	const reHash = /^#\d+$/;
	const reNumber = /^\d+$/;

	if (nftName.match(reHash) || nftName.match(reNumber)) {
		return collectionName + ': ' + nftName;
	}

	return nftName;
}

export function isMaxTwoWeeksInFuture(date: Dayjs) {
	return date.isBefore(dayjs().add(14, 'days'));
}

/**
 * Converts a date in ISO format to a human-readable string indicating how much time has passed since that timestamp.
 * @param date A string representing the date to convert, in ISO format.
 * @returns A string representing the amount of time that has passed since the provided timestamp, in human-readable format.
 */
export function timeSince(date: string): string {
	const now = dayjs();
	const timestamp = dayjs(date);
	return timestamp.from(now);
}
