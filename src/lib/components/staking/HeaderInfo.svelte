<script>
	import LongLeftArrow from '$icons/long-left-arrow.svelte';
	import { roundTwoDecimals } from '$utils/misc/roundTwoDecimals';

	export let hinataPerDay;
	export let waifuPerDay;
	export let annualPercentageReturn;
</script>

<div class="flex flex-col gap-7">
	<div class="flex items-center gap-2">
		<LongLeftArrow />
		<div class="uppercase font-semibold text-xs text-color-black" on:click>go back</div>
	</div>
	<div class="flex">
		<div class="uppercase text-white text-7xl gradient-stroke tracking-[0.15em]">stake</div>
		<div class="flex-grow" />
		<div class="flex flex-col text-right">
			<div class="text-6xl gradient-text font-semibold">{roundTwoDecimals(hinataPerDay)}</div>
			<div class="text-lg text-color-gray-base opacity-70">$HiNATA/day</div>
		</div>
	</div>
	<div class="flex">
		<div class="uppercase text-7xl gradient-text font-bold">
			{roundTwoDecimals(annualPercentageReturn)}% apr
		</div>
		<div class="flex-grow" />
		<div class="flex flex-col text-right">
			<div class="text-6xl gradient-text font-semibold">{roundTwoDecimals(waifuPerDay)}</div>
			<div class="text-lg text-color-gray-base opacity-70">$WAIFU Reward/day</div>
		</div>
	</div>
</div>
