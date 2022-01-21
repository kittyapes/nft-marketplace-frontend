<script>
	import DistributionStep from '$lib/components/airdrop/DistributionStep.svelte';
</script>

<div class="mt-20 font-bold text-5xl">How tokens are distributed</div>

<div class="flex flex-col relative">
	<div class="w-full max-w-4xl mx-auto mt-24 text-left flex overflow-hidden relative">
		<!-- Vertical Line-->
		<div class="absolute h-full left-8 z-[-1] my-6 border-dashed border-blue-500 border-l-2" />

		<!-- Steps -->
		<div class="flex flex-col gap-12">
			<!-- Step 1-->
			<DistributionStep step={1}>Up to 166,666 HiNATA distributed every month</DistributionStep>

			<!-- Step 2 -->
			<DistributionStep step={2}>75% for sellers and 25% for buyers</DistributionStep>

			<!-- Step 3 -->
			<DistributionStep step={3}>
				Rewards accumulate from month to month, claim whenever!
			</DistributionStep>

			<!-- Step 4 -->
			<DistributionStep step={4}>
				Deposit your HiNATA to the vault to earn governance rights <br /> and vote so that wallet is
				eligible for DAO incentives!
			</DistributionStep>
		</div>
	</div>

	<div class="h-full absolute z-0 top-12 right-32 pl-8">
		<img src="/img/graphics/airdrop-waifu.png" alt="waifu" class="h-full" />
	</div>
</div>
