<script lang="ts">
	export let apr = 195.4;
	export let dailyHinata = 369;
	export let dailyWaifu = 123;
</script>

<div class="pt-[12.6vw] w-full flex flex-row items-start justify-between">
	<div class="flex flex-col items-start font-semibold text-[3.8vw] leading-[100%] uppercase">
		<h1 class="text-gradient mb-[0.9vw]">STAKE</h1>
		<h1 class="text-white">{apr?.toFixed(2) || 0.0}% APR</h1>
	</div>
	<div class="flex flex-col gap-y-[0.75vw]">
		<div class="flex flex-col items-end font-semibold ">
			<h2 class="text-white text-[2.32vw] leading-[2.32vw]">{dailyHinata?.toFixed(2) || 0.0}</h2>
			<span class="text-gradient text-[1vw] leading-[1.4vw]">$HiNATA/day</span>
		</div>
		<div class="flex flex-col items-end font-semibold ">
			<h2 class="text-white text-[2.32vw] leading-[2.32vw]">{dailyWaifu?.toFixed(2) || 0.0}</h2>
			<span class="text-gradient text-[1vw] leading-[1.4vw]">WAIFU Reward/day</span>
		</div>
	</div>
</div>

<style lang="postcss">
	.text-gradient {
		background: linear-gradient(
				56.67deg,
				rgba(167, 148, 255, 0) 11.15%,
				rgba(167, 148, 255, 0.93) 57.47%,
				rgba(142, 119, 247, 0) 127.41%,
				rgba(142, 119, 247, 0) 127.41%,
				rgba(167, 148, 255, 0) 127.41%
			),
			#67d4f8;
		-webkit-text-fill-color: transparent;
		-webkit-background-clip: text;
	}
</style>
