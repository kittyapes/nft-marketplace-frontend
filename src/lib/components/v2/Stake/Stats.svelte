<script lang="ts">
	export let apr = 195.4;
	export let dailyHinata = 369;
	export let dailyWaifu = 123;
</script>

<div class="pt-56 w-full flex flex-row items-start justify-between">
	<div class="flex flex-col items-start font-semibold text-7xl leading-[100%] uppercase">
		<h1 class="text-gradient mb-3.5">STAKE</h1>
		<h1 class="text-white">{apr?.toFixed(2) || 0.0}% APR</h1>
	</div>
	<div class="flex flex-col gap-y-3">
		<div class="flex flex-col items-end font-semibold ">
			<h2 class="text-white text-5xl leading-10">{dailyHinata?.toFixed(2) || 0.0}</h2>
			<span class="text-gradient text-xl">$HiNATA/day</span>
		</div>
		<div class="flex flex-col items-end font-semibold ">
			<h2 class="text-white text-5xl leading-10">{dailyWaifu?.toFixed(2) || 0.0}</h2>
			<span class="text-gradient text-xl">WAIFU Reward/day</span>
		</div>
	</div>
</div>
