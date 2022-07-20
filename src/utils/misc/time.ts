import dayjs from 'dayjs';

export function isFuture(timestamp: number) {
	return dayjs(timestamp * 1000).isAfter(dayjs());
}

export function getListingCardTimerHtml(startDate: number, duration: number) {
	const cleanup = (s) => s.replace(/0./g, '');

	// Starting in...
	if (isFuture(startDate)) {
		const inSeconds = startDate - dayjs().unix();
		const in_ = cleanup(dayjs.duration(inSeconds, 's').format('D[d] H[h] M[m]'));

		return `<span class="text-transparent bg-gradient-to-r bg-clip-text from-color-purple to-color-blue">Starting in: ${in_}</span>`;
	}

	if (isFuture(startDate + duration)) {
		const inSeconds = startDate + duration - dayjs().unix();
		const in_ = cleanup(dayjs.duration(inSeconds, 's').format('D[d] H[h] M[m]'));

		return `<span class="text-color-red">Ending in: ${in_}</span>`;
	}

	return `<div class="listing-timer text-[10px] font-bold uppercase text-color-red">Expired</div>`;
}
