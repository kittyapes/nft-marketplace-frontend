import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);

export function isFuture(timestamp: number) {
	return dayjs(timestamp * 1000).isAfter(dayjs());
}

export function getListingCardTimerHtml(
	startDate: number,
	duration: number,
	endDate: number,
	gridStyle: 'normal' | 'dense' | 'masonry' = 'normal',
) {
	// removed since it seems it is causing issues
	// const cleanup = (s) => s.replace(/0./g, '');

	const labelStyles =
		gridStyle === 'normal'
			? 'text-[10px] 2xl:text-sm leading-6 2xl:leading-7'
			: 'text-[8px] 2xl:text-[10px] leading-3 2xl:leading-4';
	const valueStyles =
		gridStyle === 'normal'
			? 'text-base 2xl:text-xl leading-6 2xl:leading-7'
			: 'text-xs 2xl:text-sm leading-3 2xl:leading-4';

	// Starting in...
	if (isFuture(startDate)) {
		const inSeconds = startDate - dayjs().unix();
		const in_ = dayjs.duration(inSeconds, 's');

		return `
		<div class="flex flex-col items-start">
				<div class="text-gradient font-bold ${labelStyles}">
					Starts in: 
				</div>
				<div class="text-white font-semibold ${valueStyles}">
					${in_.days() + in_.months() * 30}d ${in_.hours()}h ${in_.days() + in_.minutes() * 30}m 
				</div>
				</div>`;
	}

	if (isFuture(startDate + duration)) {
		const endingIn = dayjs.duration(endDate - dayjs().unix(), 'seconds');

		if (endingIn.asMilliseconds() === 0)
			return `<div class="listing-timer text-[10px] font-bold uppercase text-color-red">Expired</div>`;
		return `<div class="flex flex-col items-end">
					<div class="text-gradient font-bold ${labelStyles}">
						Ends in: 
					</div>
					<div class="text-white font-semibold ${valueStyles}">
					${endingIn.days() + endingIn.months() * 30}d ${endingIn.hours()}h ${endingIn.minutes()}m
					</div>
				</div>`;
	}

	return `<div class="listing-timer text-[10px] font-bold uppercase text-color-red">Expired</div>`;
}
