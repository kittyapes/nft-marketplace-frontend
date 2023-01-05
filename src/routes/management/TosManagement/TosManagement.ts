import type { TosVersionObject } from '$utils/api/tos';
import dayjs from 'dayjs';

export function nextVersionLabel(versions: TosVersionObject[]) {
	const base = dayjs().format('MM-DD-YYYY');

	let index = 0;

	for (const version of versions) {
		if (version.version.startsWith(base)) {
			index++;
		}
	}

	if (index === 0) {
		return base;
	}

	return base + '-' + index;
}
