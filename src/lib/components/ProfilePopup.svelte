<script>
	import { goto } from '$app/navigation';
	import Disconnect from '$icons/disconnect.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { disconnectWallet } from '$utils/wallet/connectWallet';
	import { slide } from 'svelte/transition';
	import Button from './Button.svelte';
</script>

<div
	id="container"
	class="absolute bg-white w-72 top-20 right-4 rounded-2xl z-10 overflow-hidden px-4 py-4"
	transition:slide
>
	<div class="grid gap-2">
		<Button
			variant="rounded-outline"
			class="!w-full !py-2"
			on:click={() => goto(`/profile/${$currentUserAddress}`)}
		>
			My Profile
		</Button>
		<!-- <Button variant="rounded-outline" --width="100%" --py="0.5rem">My Collections</Button> -->
	</div>

	<div class="h-px bg-color-gray-light my-3" />

	<button class="flex w-full transition-btn" on:click={disconnectWallet}>
		<span class="uppercase flex-grow text-left font-semibold">Disconnect</span>
		<Disconnect />
	</button>
</div>

<style>
	#container {
		box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.12);
	}
</style>
