<script>
	import LockupPeriod from './LockupPeriod.svelte';
	import { fade } from 'svelte/transition';
	import Eth from '$icons/eth.svelte';
	import { connectToWallet } from '$utils/wallet/connectWallet';
	import { appSigner, userClaimsObject } from '$stores/wallet';
	import { ethers } from 'ethers';
	import claimAirdropTokens from '$utils/wallet/claimAirdropTokens';
	import Button from '../Button.svelte';

	const connectWallet = async () => {
		await connectToWallet();
	};
</script>

<div
	class="w-full max-w-5xl m-auto bg-black bg-opacity-5 border-4 border-black border-opacity-20 mt-12  rounded-2xl"
	in:fade
>
	<div class="grid grid-cols-3">
		<!-- My Volume -->
		<div
			class="w-full h-full p-11 flex flex-col text-left border-r-2 border-black border-opacity-20"
		>
			<div class="text-2xl opacity-60 font-bold">My Volume</div>
			<div class="text-2xl font-bold flex items-center gap-3 mt-3"><Eth /> 34.25 ETH Traded</div>
			<div class="mt-10">
				Usage distributions are calculated by market volume denominated in ETH at the time of
				transaction.
			</div>
		</div>

		<!-- Claim -->
		<div
			class="w-full h-full p-11 flex flex-col text-left border-r-2 border-black border-opacity-20"
		>
			<div class="text-2xl opacity-60 font-bold">Claim</div>
			<div class="text-2xl font-bold flex items-center gap-3 mt-3">
				{$userClaimsObject ? ethers.utils.formatEther($userClaimsObject.user.amount) : 0} HiNATA
			</div>
			<div class="mt-7">
				{#if $appSigner}
					<Button
						gradient
						rounded
						on:click={claimAirdropTokens}
						disabled={!$userClaimsObject ||
							parseFloat(ethers.utils.formatEther($userClaimsObject?.user.amount)) <= 0}
					>
						Claim
					</Button>
				{:else}
					<Button gradient rounded class="whitespace-nowrap w-44" on:click={connectWallet}>
						Connect To Wallet
					</Button>
				{/if}
			</div>
		</div>

		<!-- Stake -->
		<div class="w-full h-full p-14 flex flex-col text-left ">
			<div class="text-2xl opacity-60 font-bold">Stake</div>

			<div class="uppercase text-left my-5">lockup period</div>

			<LockupPeriod />

			<div class="text-left mt-4">Stake your HINATA to the DAO</div>

			<div class="w-28 mt-2" class:hidden={!$appSigner}>
				<Button gradient rounded>STAKE</Button>
			</div>
		</div>
	</div>
</div>
