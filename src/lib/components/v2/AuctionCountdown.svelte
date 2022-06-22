<script lang="ts">
	import dayjs from 'dayjs';
	import durationExt from 'dayjs/plugin/duration';
	import { onMount } from 'svelte';

	dayjs.extend(durationExt);

	export let startTime: string;
	export let duration: number;

	$: endTime = dayjs(startTime).add(duration, 'seconds');
	$: remaining = dayjs.duration(dayjs(endTime).diff(dayjs(), 'seconds'), 'seconds');

	$: values = [
		['Days', remaining.days()],
		['Hours', remaining.hours()],
		['Minutes', remaining.minutes()],
		['Seconds', remaining.seconds()]
	];

	onMount(() => setInterval(() => (endTime = endTime), 1000));
</script>

<div class="flex gap-4">
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
