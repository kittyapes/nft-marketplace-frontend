<script>
	import { goto } from '$app/navigation';
	import { getIconUrl } from '$utils/misc/getIconUrl';
	import { createEventDispatcher } from 'svelte';

	export let successDescription = 'NFT purchase was successful.';
	export let showProfileButton = false;
	export let showMarketplaceButton = false;

	const dispatch = createEventDispatcher();

	function handleViewProfile() {
		dispatch('close-popup');
		goto('/profile');
	}
</script>

<div class="flex flex-col justify-center h-[90%]">
	<img class="h-24" src={getIconUrl('gradient-check')} alt="" />

	<div class="font-bold text-2xl text-center gradient-text mt-4">Success!</div>
	<div class="opacity-50 text-center mt-4">{successDescription}</div>

	<div class="flex mt-24 gap-4 justify-center">
		{#if showProfileButton}
			<button class="btn btn-gradient btn-rounded uppercase font-bold w-1/2" on:click={handleViewProfile}>View Profile</button>
		{/if}

		{#if showMarketplaceButton}
			<button class="btn btn-gradient btn-rounded uppercase font-bold w-1/2" on:click={() => dispatch('close-popup')}>Continue shopping</button>
		{/if}
	</div>
</div>
