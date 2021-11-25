<script>
	import DistributionStep from '$lib/components/airdrop/DistributionStep.svelte';
</script>

<div class="mt-20 font-bold text-5xl">How tokens are distributed</div>

<div class="flex flex-col relative">
	<div class="w-full max-w-4xl mx-auto mt-24 text-left flex overflow-hidden relative">
		<!-- Vertical Line-->
		<div class="absolute h-full  left-8 z-0 my-6  border-dashed border-blue-500 border-l-2" />

		<!-- Steps -->
		<div class="z-20 flex flex-col gap-12">
			<!-- Step 1-->
			<DistributionStep step={1}
				>A portion of the 41,250 $HiNATA distributed every week</DistributionStep
			>

			<!-- Step 2 -->
			<DistributionStep step={2}>50% for buyers and 50% sellers</DistributionStep>

			<!-- Step 3 -->
			<DistributionStep step={3}>Unclaimed rewards are rolled into the next month</DistributionStep>

			<!-- Step 4 -->
			<DistributionStep step={4}>Lock your tokens up to continue earning!</DistributionStep>
		</div>
	</div>

	<div class="w-1/3 absolute z-0 top-12 left-2/4 pl-8">
		<img src="/img/graphics/airdrop-waifu.png" alt="waifu" />
	</div>
</div>
