<script>
	import Container from '$lib/components/staking/Container.svelte';
	import HinataStepOne from '$lib/components/staking/HinataStepOne.svelte';
	import LeftPane from '$lib/components/staking/LeftPane.svelte';
	import Pill from '$lib/components/staking/Pill.svelte';
	import V1StepOne from '$lib/components/staking/V1StepOne.svelte';

	let mode;
</script>

<Container class="my-32">
	<LeftPane variant={(mode === 'v1' && 'convert-your-tokens') || 'earn-your-nfts'} />

	<div class="flex-grow flex flex-col items-center max-w-xl">
		<Pill bind:mode />

		<div class="w-full h-px bg-[#1d1d1d4d] mt-4" />

		{#if mode === 'v1'}
			<V1StepOne />
		{:else}
			<HinataStepOne />
		{/if}
	</div>
</Container>
