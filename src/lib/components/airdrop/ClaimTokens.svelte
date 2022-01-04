<script lang="ts">
	import Button from '../Button.svelte';
	import { fade } from 'svelte/transition';
	import LockupPeriod from './LockupPeriod.svelte';
	import { merkleContractIsActive, userClaimsArray, userHinataBalance } from '$stores/wallet';
	import { ethers } from 'ethers';
	import { claimAirdropTokens } from '$utils/wallet/airdropDistribution';

	let claimAmount = 0;
	let hasClaimed = false;
	const updateValues = (claims: ClaimsObject[]) => {
		if (claims) {
			hasClaimed =
				$userClaimsArray?.filter((claimsObj) => claimsObj.user.hasClaimed).length ===
				$userClaimsArray?.length;
			if (hasClaimed) {
				claimAmount = 0;
			} else {
				claimAmount = 0;
				$userClaimsArray.map((claimsObj) => {
					if (!claimsObj.user.hasClaimed) {
						claimAmount += +ethers.utils.formatEther(claimsObj.user.amount);
					}
				});
			}
		}
	};
	$: updateValues($userClaimsArray);
</script>

<div
	class="w-full max-w-3xl m-auto bg-black bg-opacity-5 container border-4 border-black px-4 border-opacity-20 mt-12 py-11 rounded-2xl"
	in:fade
>
	<div class="w-full max-w-md m-auto text-left">
		<div class="text-4xl text-color-black font-bold">Claim your tokens</div>

		<div class="mt-7">
			Your ethereum account is eligible for this airdrop. Please claim your tokens below by
			submitting a transaction which will pull them to your wallet
		</div>

		<div class="font-bold uppercase mt-7">YOU WILL RECIEVE...</div>

		<div class="w-full flex flex-col gap-4 mt-5">
			<div class="w-96 flex justify-between items-center mx-auto">
				<span class="font-bold tracking-wider w-3/5">{claimAmount} HINATA TOKENS</span>
				<div class="w-36">
					<Button
						gradient
						rounded
						on:click={() =>
							!(!$merkleContractIsActive || hasClaimed || claimAmount <= 0) && claimAirdropTokens()}
						disabled={!$merkleContractIsActive || hasClaimed || claimAmount <= 0}
					>
						{#if $merkleContractIsActive}
							{#if hasClaimed}
								Already Claimed
							{:else if !hasClaimed && claimAmount > 0}
								Claim
							{:else}
								Not Eligible
							{/if}
						{:else}
							<span class:text-xs={!$merkleContractIsActive}> Claim Window Passed </span>
						{/if}
					</Button>
				</div>
			</div>

			<div class="w-96 flex justify-between items-center mx-auto">
				<span class="font-bold tracking-wider w-3/5">14,204 HINATA TOKENS</span>
				<div class="w-36">
					<Button rounded class="bg-gradient-to-r from-gray-300 to-transparent">Escrowed</Button>
				</div>
			</div>

			<div class="w-96 flex justify-between items-center mx-auto">
				<div class="font-bold uppercase">Escrow is Unlocked In...</div>
				<div class="text-xl font-bold w-36">29D, 4H, 17M</div>
			</div>
		</div>
	</div>

	<!-- horizontal line -->
	<div class="w-full h-px bg-black bg-opacity-20 mt-7" />

	<div class="w-full max-w-md m-auto text-left mt-12">
		<div class="font-bold uppercase mt-7 text-left">Your wallet balance</div>

		<div class="w-full flex flex-col gap-4 mt-5">
			<div class="w-96 flex items-center justify-between mx-auto">
				<span class="font-bold tracking-wider w-3/5">{$userHinataBalance} HINATA TOKENS</span>
				<div class="flex-grow-0 w-36">
					<Button rounded gradient>STAKE</Button>
				</div>
			</div>
		</div>

		<div class="flex gap-6 mt-7 items-center">
			<div class="uppercase text-left">lockup period</div>

			<LockupPeriod />
		</div>

		<div class="mt-7">
			You can deposit your tokens to the vault to earn governance rewards and become a DAO member
		</div>
	</div>
</div>
