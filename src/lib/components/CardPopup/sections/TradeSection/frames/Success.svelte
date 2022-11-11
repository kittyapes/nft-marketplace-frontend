<script lang="ts">
	import { goto } from '$app/navigation';
	import SuccessCheck from '$icons/success-check.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let message = 'Action performed successfully.';

	function handleViewProfile() {
		dispatch('close-popup');
		goto('/profile/' + $currentUserAddress);
	}

	function handleContinueShopping() {
		dispatch('close-popup');
		goto('/marketplace');
	}
</script>

<div>
	<div class="flex flex-col justify-center gradient-border-green gap-12 aspect-1 mb-8">
		<div class="text-center mt-4 text-3xl text-white">{message}</div>
		<div class="flex items-center justify-center gap-8">
			<SuccessCheck />
			<div class="gradient-text-green text-7xl">Success!</div>
		</div>
	</div>

	<div class="flex gap-4">
		<PrimaryButton on:click={handleViewProfile}>View Profile</PrimaryButton>
		<PrimaryButton on:click={handleContinueShopping}>Continue Shopping</PrimaryButton>
	</div>
</div>

<style>
	.gradient-border-green {
		border-image: linear-gradient(90deg, #adff00 0%, #4cef00 51.68%, #59ff9c 101.25%) 1;
		@apply border-solid border-4;
	}

	.gradient-text-green {
		@apply text-transparent;
		background: linear-gradient(90deg, #adff00 0%, #4cef00 51.68%, #59ff9c 101.25%);
		background-clip: text;
	}
</style>
