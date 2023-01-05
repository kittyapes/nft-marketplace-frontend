<script>
	import ErrorCross from '$icons/error-cross.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { createEventDispatcher } from 'svelte';
	import CreateListing from './CreateListing.svelte';

	const dispatch = createEventDispatcher();

	export let message = 'Failed to perform action!';
</script>

<div class="aspect-1 flex flex-col">
	<div class="flex flex-col justify-center gradient-border-red gap-8 mb-8 flex-grow">
		<div class="text-center mt-4 text-xl text-white">{message}</div>
		<div class="flex items-center justify-center gap-3">
			<div class="w-16">
				<ErrorCross />
			</div>

			<div class="gradient-text-red text-4xl">Error!</div>
		</div>
	</div>

	<PrimaryButton on:click={() => dispatch('set-frame', { component: CreateListing })}>Continue shopping</PrimaryButton>
</div>

<style>
	.gradient-border-red {
		border-image: linear-gradient(90deg, #ff297c 0.46%, #f21e91 49.71%, #fc0363 100%) 1;
		@apply border-solid border-4;
	}

	.gradient-text-red {
		@apply text-transparent;
		background: linear-gradient(90deg, #ff297c 0.46%, #f21e91 49.71%, #fc0363 100%);
		background-clip: text;
	}
</style>
