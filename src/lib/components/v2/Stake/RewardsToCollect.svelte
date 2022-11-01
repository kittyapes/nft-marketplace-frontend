<script>
	import RewardsToCollectCard from './RewardsToCollectCard.svelte';
	import SectionWrapper from './SectionWrapper.svelte';
	export let token;
</script>

<SectionWrapper>
	<div class="text-[1.16vw] leading-[1.16vw]">
		<h3 class=" text-left text-[1.4vw] leading-[1.4vw] mb-[1.85vw]">Rewards to collect</h3>
		<div class="flex flex-col gap-y-[5.8vw]">
			<RewardsToCollectCard tokenSymbol="HiNATA" />
			{#if token === 'HINATA LP'}
				<RewardsToCollectCard tokenSymbol="WAIFU" />
			{/if}
		</div>
	</div>
</SectionWrapper>
