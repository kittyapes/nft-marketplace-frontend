import dayjs from 'dayjs';
import durationExt from 'dayjs/plugin/duration.js';

dayjs.extend(durationExt);

export function getValuesForStartingTs(startTs: number) {
	const startTime = dayjs(startTs * 1000);
	const remaining = dayjs.duration(startTime.diff(dayjs(), 'seconds'), 'seconds');

	return [
		['Days', remaining.days()],
		['Hours', remaining.hours()],
		['Minutes', remaining.minutes()],
		['Seconds', remaining.seconds()],
		// @ts-ignore
	].map(([unit, value]) => [unit, Math.max(0, value)]);
}

export function getValuesForEndingTs(startTs: number, duration: number) {
	const endTime = dayjs(startTs * 1000).add(duration, 'seconds');
	const remaining = dayjs.duration(endTime.diff(dayjs(), 'seconds'), 'seconds');

	return [
		['Days', remaining.days()],
		['Hours', remaining.hours()],
		['Minutes', remaining.minutes()],
		['Seconds', remaining.seconds()],
		// @ts-ignore
	].map(([unit, value]) => [unit, Math.max(0, value)]);
}
