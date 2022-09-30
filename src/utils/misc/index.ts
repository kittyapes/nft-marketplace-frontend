export function matches(a: string, b: string) {
	return a?.toLocaleLowerCase() === b?.toLocaleLowerCase();
}

/**
 * Returns an array of objects to be used when populating the listing duration setting
 * dropdown. The contents of the array depend on whether the user is an admin or not.
 * @param isAdmin Whether values that are supposed to be only used by admins should be returned.
 */
export function buildListingDurationOptions(isAdmin: boolean) {
	const options: { label: string; value: number; style?: string }[] = [
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

	return options;
}
