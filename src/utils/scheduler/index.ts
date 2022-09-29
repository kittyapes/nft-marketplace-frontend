import { writable, type Writable } from 'svelte/store';

const schedules: Record<number, Writable<number>> = {};

export function getInterval(ms: number) {
	if (schedules[ms]) {
		return schedules[ms];
	}

	const store = writable(Date.now());

	schedules[ms] = store;

	setInterval(() => {
		store.set(Date.now());
	}, ms);

	return store;
}
