<script>
	import Container from './_lib/Container.svelte';
	import HinataStepOne from './_lib/HinataStepOne.svelte';
	import LeftPane from './_lib/LeftPane.svelte';
	import Pill from './_lib/Pill.svelte';
	import V1StepOne from './_lib/V1StepOne.svelte';

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
