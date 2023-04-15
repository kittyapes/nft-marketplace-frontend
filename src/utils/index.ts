import { AxiosError } from 'axios';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { notifyError } from './toast';

import relativeTime from 'dayjs/plugin/relativeTime';
import { BigNumber } from 'ethers';

dayjs.extend(relativeTime);

export class HandledError extends Error {
	cause: Error;

	constructor(message: string, cause?: Error) {
		super(message);
		this.cause = cause || new Error(message);
		this.name = 'HandledError';
	}
}

export class ErrNotificationError extends HandledError {
	constructor(message: string, cause?: Error) {
		super(message, cause);

		notifyError(message);
	}
}

export function handleErrActionRejected(
	err: Error & { code?: string },
	message = 'Action was rejected by user.',
) {
	if (err.code === 'ACTION_REJECTED' || err.message.includes('User denied message signature')) {
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

/**
 * Parse a full ID string into its constituent parts.
 *
 * @param fullId The full ID string to parse, in the format `collectionAddress:tokenId`.
 * @returns An object with `collectionAddress` and `tokenId` fields representing the parsed values.
 * @throws An error if the input string is not in the expected format.
 */
export function parseFullId(fullId: string): { collectionAddress: string; tokenId: BigNumber } {
	const [collectionAddress, tokenId] = fullId.split(':');
	if (!collectionAddress || !tokenId) {
		throw new Error('Invalid full ID format');
	}
	return { collectionAddress, tokenId: BigNumber.from(tokenId) };
}

/**
 * Returns the number of seconds since the Unix epoch (January 1, 1970).
 *
 * @returns The number of seconds since the Unix epoch as a `number`.
 */
export function getSecondsSinceEpoch(): number {
	return Math.floor(Date.now() / 1000);
}

/**
 * Generates a random nonce using the browser's crypto API that spans the entire range of `BigNumber` values.
 *
 * @returns A random nonce as a `BigNumber`.
 */
export function generateRandomNonce(): BigNumber {
	const maxInt = BigNumber.from(2).pow(256).sub(1); // Maximum possible value for a uint256
	const randomBytes = window.crypto.getRandomValues(new Uint8Array(32));
	const randomValue = BigNumber.from(randomBytes);

	// Ensure the random value is less than the maximum possible uint256 value
	return randomValue.gt(maxInt) ? randomValue.mod(maxInt) : randomValue;
}
