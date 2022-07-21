<script lang="ts">
	import dayjs from 'dayjs';
	import durationExt from 'dayjs/plugin/duration.js';
	import { onDestroy, onMount } from 'svelte';

	dayjs.extend(durationExt);

	export let startTime: number;
	export let duration: number;

	$: endTime = dayjs(startTime * 1000).add(duration, 'seconds');
	$: remaining = dayjs.duration(endTime.diff(dayjs(), 'seconds'), 'seconds');

	$: values = [
		['Days', remaining.days()],
		['Hours', remaining.hours()],
		['Minutes', remaining.minutes()],
		['Seconds', remaining.seconds()]
		// @ts-ignore
	].map(([unit, value]) => [unit, Math.max(0, value)]);

	let interval: NodeJS.Timer;

	onMount(() => {
		interval = setInterval(() => (endTime = endTime), 1000);
	});

	onDestroy(() => clearInterval(interval));
</script>

<div class="flex justify-center gap-4">
	{#each values as [label, value]}
		<div>
			<div class="relative grid w-16 h-16 bg-white rounded-lg place-items-center">
				<div class="absolute w-full h-full rounded-lg bg-gradient-to-r from-color-purple to-color-blue opacity-10" />
				<span class="text-2xl font-bold opacity-70">
					{value}
				</span>
			</div>

			<div class="mt-2 text-sm text-center opacity-50">{label}</div>
		</div>
	{/each}
</div>
