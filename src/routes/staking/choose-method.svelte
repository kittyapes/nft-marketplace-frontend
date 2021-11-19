<script>
	import Container from './_lib/Container.svelte';
	import ConvertYourTokens from './_lib/ConvertYourTokens.svelte';
	import EarnYourNfts from './_lib/EarnYourNfts.svelte';
	import HinataStepOne from './_lib/HinataStepOne.svelte';
	import Pill from './_lib/Pill.svelte';
	import V1StepOne from './_lib/V1StepOne.svelte';

	let mode;
</script>

<Container class="my-32">
	{#if mode === 'v1'}
		<ConvertYourTokens />
	{:else}
		<EarnYourNfts />
	{/if}

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
