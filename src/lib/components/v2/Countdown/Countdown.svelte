<script lang="ts">
	import dayjs from 'dayjs';
	import durationExt from 'dayjs/plugin/duration.js';
	import { onDestroy, onMount } from 'svelte';

	dayjs.extend(durationExt);

	export let startTime: number;
	export let duration: number;
	export let expired: boolean = false;

	$: endTime = dayjs(startTime * 1000).add(duration, 'seconds');
	$: remaining = dayjs.duration(endTime.diff(dayjs(), 'seconds'), 'seconds');

	$: values = [
		['Days', remaining.days()],
		['Hours', remaining.hours()],
		['Minutes', remaining.minutes()],
		['Seconds', remaining.seconds()],
		// @ts-ignore
	].map(([unit, value]) => [unit, Math.max(0, value)]);

	let interval: NodeJS.Timer;

	onMount(() => {
		interval = setInterval(() => (endTime = endTime), 1000);
	});

	onDestroy(() => clearInterval(interval));
</script>

<div class="flex justify-center gap-4 text-white">
	{#each values as [label, value]}
		<div>
			<div class="relative grid w-16 h-16 place-items-center border-white border-2">
				<div class="absolute w-full h-full bg-gradient-to-r from-color-purple to-color-blue opacity-10" />
				<span class="text-2xl font-bold">
					{#if expired}
						0
					{:else}
						{value}
					{/if}
				</span>
			</div>

			<div class="mt-2 text-center">{label}</div>
		</div>
	{/each}
</div>
