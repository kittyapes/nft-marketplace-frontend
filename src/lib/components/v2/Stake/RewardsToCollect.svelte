<script>
	import RewardsToCollectCard from './RewardsToCollectCard.svelte';
	import SectionWrapper from './SectionWrapper.svelte';
	export let token;
</script>

<SectionWrapper>
	<div class="text-2xl leading-5 w-1/2">
		<h3 class=" text-left text-2xl leading-6 mb-8">Rewards to collect</h3>
		<div class="flex flex-col gap-y-24">
			<RewardsToCollectCard tokenSymbol="HiNATA" />
			{#if token === 'HINATA LP'}
				<RewardsToCollectCard tokenSymbol="WAIFU" />
			{/if}
		</div>
	</div>
</SectionWrapper>
