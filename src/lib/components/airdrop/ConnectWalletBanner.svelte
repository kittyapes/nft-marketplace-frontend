<script>
	import RoundedButton from '../RoundedButton.svelte';
	import { fade } from 'svelte/transition';

	export let walletConnected = false;

	const connectWallet = () => {
		walletConnected = true;
	};
</script>

<div
	class="w-full max-w-3xl m-auto bg-black bg-opacity-5 border-4 border-black border-opacity-20 mt-12 py-11 px-7 rounded-2xl"
	in:fade
>
	<div
		class="text-lg font-bold text-color-black flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12"
	>
		Connect your wallet to check your eligibility

		<div class="flex-grow-0" on:click={connectWallet}>
			<RoundedButton bgColor="from-color-purple to-color-blue">
				<div class="px-8">Connect Wallet</div>
			</RoundedButton>
		</div>
	</div>
</div>
