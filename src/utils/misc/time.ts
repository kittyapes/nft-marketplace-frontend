import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);

export function isFuture(timestamp: number) {
	return dayjs(timestamp * 1000).isAfter(dayjs());
}

export function getListingCardTimerHtml(startDate: number, duration: number) {
	// removed since it seems it is causing issues
	// const cleanup = (s) => s.replace(/0./g, '');

	// Starting in...
	if (isFuture(startDate)) {
		const inSeconds = startDate - dayjs().unix();
		const in_ = dayjs.duration(inSeconds, 's').format('D[d] H[h] m[m]');

		return `<div class="flex flex-col">
				<div class="text-gradient font-bold text-sm">
					Starts in: 
				</div>
				<div class="text-white font-semibold text-lg">
					${in_}
				</div>
				</div>`;
	}

	if (isFuture(startDate + duration)) {
		const endDate = dayjs.unix(startDate + duration);
		const endingIn = dayjs.duration(endDate.unix() - dayjs().unix(), 'seconds');

		const in_ = endingIn.format('D[d] H[h] m[m]');

		if (endingIn.asMilliseconds() === 0) return `<div class="listing-timer text-[10px] font-bold uppercase text-color-red">Expired</div>`;
		return `<div class="flex flex-col">
					<div class="text-gradient font-bold text-sm">
						Ends in: 
					</div>
					<div class="text-white font-semibold text-lg">
						${in_}
					</div>
				</div>`;
	}

	return `<div class="listing-timer text-[10px] font-bold uppercase text-color-red">Expired</div>`;
}
