import dayjs from 'dayjs';

export function matches(a: string, b: string) {
	return a?.toLocaleLowerCase() === b?.toLocaleLowerCase();
}

export interface ListingDurationOption {
	// Used for example in the duration dropdown
	label: string;

	// Number of seconds a listing should last
	value: number;
}

/**
 * Returns an array of objects to be used when populating the listing duration setting
 * dropdown. The contents of the array depend on whether the user is an admin or not.
 * @param isAdmin Whether values that are supposed to be only used by admins should be returned.
 * @param currentDuration Because this function is used to build the list of durations when editing
 * a listing and a listing cannot have its duration updated to a lower value than the current
 * duration of the listing, it is possible to give a `currentDuration` argument to the function.
 * When a non-zero value is given, each shorter duration than `currentDuration` is filtered out
 * from the list of returned durations.
 */
export function buildListingDurationOptions(isAdmin: boolean, currentDuration?: number): ListingDurationOption[] {
	let options: { label: string; value: number; style?: string }[] = [
		{ label: '1 day', value: 1 * 24 * 3600 },
		{ label: '3 days', value: 3 * 24 * 3600 },
		{ label: '7 days', value: 7 * 24 * 3600 },
		{ label: '1 month', value: 30 * 24 * 3600 },
		{ label: '3 months', value: 90 * 24 * 3600 },
		{ label: '6 months', value: 180 * 24 * 3600 },
	];

	if (isAdmin) {
		options.unshift(
			{ label: '1 minute', value: 1 * 60, style: 'color: #868BF7' },
			{ label: '3 minutes', value: 3 * 60, style: 'color: #868BF7' },
			{ label: '5 minutes', value: 5 * 60, style: 'color: #868BF7' },
			{ label: '10 minutes', value: 10 * 60, style: 'color: #868BF7' },
		);
	}

	if (currentDuration) {
		options = options.filter((i) => i.value >= currentDuration);
	}

	return options;
}

/**
 * @returns `true` or `false` depending on whether the listing is expired or not.
 */
export function isListingExpired(startTs: number, duration: number) {
	return dayjs.unix(startTs + duration).isBefore(dayjs());
}

export function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
