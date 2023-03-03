<script lang="ts">
	import Button from '../Button.svelte';
	import { fade } from 'svelte/transition';
	import {
		communityMerkleContractIsActive,
		communityClaimsArray,
		userHinataBalance,
		communityEscrowUnlock,
		isAirdropClaiming,
		stakedHinataBalance,
		stakingWaifuRewards,
		hinataStakingAllowance,
		currentUserAddress
	} from '$stores/wallet';
	import { ethers } from 'ethers';
	import { claimAirdropTokens } from '$utils/contracts/airdropDistribution';
	import HorizontailOptionSwitcher from '../HorizontailOptionSwitcher.svelte';
	import ThemedCross from '$icons/themed-cross.svelte';
	import daysFromNow from '$utils/daysFromNow';
	import { claimWaifuRewards, stakeTokens } from '$contracts/staking_v1';
	import { setPopup } from '$utils/popup';
	import ProceedStakePopup from './ProceedStakePopup.svelte';
	import { hinataTokensBalance, increaseHinataAllowance } from '$utils/contracts/tokenBalances';
	import { hoverHint } from '$actions/hoverHint';

	let communityClaimAmount = 0;
	let communityEscrowed = 0;
	let communityHasClaimed = false;
	const communityUpdateValues = (claims: ClaimsObject[]) => {
		if (claims) {
			communityHasClaimed =
				$communityClaimsArray?.filter((claimsObj) => claimsObj.user.hasClaimed).length ===
				$communityClaimsArray?.length;
			if (communityHasClaimed) {
				communityClaimAmount = 0;
				communityEscrowed = 0;
			} else {
				communityClaimAmount = 0;
				$communityClaimsArray.map((claimsObj) => {
					if (!claimsObj.user.hasClaimed && claimsObj.nextClaimDuration <= 0) {
						communityClaimAmount += +ethers.utils.formatEther(claimsObj.user.amount);
					} else if (!claimsObj.user.hasClaimed && claimsObj.nextClaimDuration > 0) {
						// Remaining escrowed tokens
						communityEscrowed += +ethers.utils.formatEther(claimsObj.user.amount);
					}
				});
			}
		}
	};

	$: communityUpdateValues($communityClaimsArray);
	$: parsedCommunityEscrowUnlockDate = ((dateObj: {
		days: number;
		hours: number;
		minutes: number;
		seconds: number;
	}) => {
		return dateObj ? `${dateObj.days}D ${dateObj.hours}H ${dateObj.minutes}M` : 'N/A';
	})(daysFromNow($communityEscrowUnlock));

	const stakeAllTokens = () => {
		setPopup(ProceedStakePopup, {
			props: {
				numberOfHinata: $userHinataBalance,
				duration: selectedDuration.duration,
				onContinue: async () =>
					stakeTokens(await hinataTokensBalance($currentUserAddress), selectedDuration.duration)
			}
		});
	};

	// use this for mainnet
	/*
	[
			{ label: '3MO', duration: 7776000 },
			{ label: '1YR', duration: 31104000 },
			{ label: '2YR', duration: 62208000 }
		];
		*/

	const stakeDurationOptions = [
		{ label: '1H', duration: 3600 },
		{ label: '2H', duration: 7200 },
		{ label: '3H', duration: 10800 }
	];

	let selectedDuration = stakeDurationOptions[1];

	$: stakingAllowance = $hinataStakingAllowance;

	$: claimEligible =
		$userHinataBalance > 0 ||
		communityClaimAmount > 0 ||
		communityEscrowed > 0 ||
		$communityClaimsArray?.length > 0 ||
		$stakingWaifuRewards > 0 ||
		$stakedHinataBalance > 0;
</script>

{#if claimEligible}
	<div
		class="w-full max-w-5xl m-auto bg-black bg-opacity-5 container border-4 border-black px-4 border-opacity-20 mt-12 py-11 rounded-2xl"
		in:fade
	>
		<div class="w-full max-w-md m-auto text-left">
			<div class="text-4xl text-color-black font-bold">Claim your tokens</div>

			<div class="mt-7">
				Your ethereum account is eligible for this airdrop. Please claim your tokens below by
				submitting a transaction which will pull them to your wallet
			</div>

			<div class="font-bold uppercase mt-7">YOU WILL RECEIVE...</div>

			<div class="w-full flex flex-col gap-4 mt-5">
				<div class="w-96 flex justify-between items-center mx-auto">
					<span class="font-bold tracking-wider w-3/5"
						>{parseFloat(communityClaimAmount.toFixed(2))} HiNATA TOKENS</span
					>
					<div class="w-36">
						<Button
							gradient
							rounded
							on:click={() =>
								!(
									!$communityMerkleContractIsActive ||
									communityHasClaimed ||
									communityClaimAmount <= 0
								) && claimAirdropTokens('community')}
							disabled={$isAirdropClaiming ||
								!$communityMerkleContractIsActive ||
								communityHasClaimed ||
								communityClaimAmount <= 0}
						>
							{#if $communityMerkleContractIsActive}
								{#if communityHasClaimed}
									Already Claimed
								{:else if !communityHasClaimed && communityClaimAmount > 0}
									Claim
								{:else}
									Not Eligible
								{/if}
							{:else}
								Claim
							{/if}
						</Button>
					</div>
				</div>

				<div class="w-96 flex justify-between items-center mx-auto">
					<span class="font-bold tracking-wider w-3/5"
						>{parseFloat(communityEscrowed.toFixed(2))} HiNATA TOKENS</span
					>
					<div class="w-36">
						<Button
							rounded
							class="bg-gradient-to-r from-gray-300 to-transparent font-semibold text-[#777575]"
						>
							Escrowed
						</Button>
					</div>
				</div>

				<div class="w-96 flex justify-between items-center mx-auto mt-4">
					<div class="font-semibold text-sm uppercase">Escrow is Unlocked In...</div>
					<div class="text-xl font-bold w-36">
						{parsedCommunityEscrowUnlockDate}
					</div>
				</div>
			</div>
		</div>

		<!-- horizontal line -->
		<div class="w-full h-px bg-black bg-opacity-20 mt-7" />

		<div class="w-full pt-12 text-left pl-32 pr-16 max-w-3xl mx-auto">
			<div class="font-bold uppercase">Your wallet balance</div>

			<div class="grid grid-cols-2 place-items-center">
				<div class="font-semibold w-full pl-8">
					{parseFloat($userHinataBalance.toFixed(2))} HiNATA TOKENS
				</div>
				<Button
					rounded
					gradient
					on:click={() => (stakingAllowance > 0 ? stakeAllTokens() : increaseHinataAllowance())}
					disabled={$userHinataBalance <= 0}>{stakingAllowance > 0 ? 'Stake' : 'Approve'}</Button
				>
			</div>

			<div class="grid grid-cols-2 place-items-center mt-16">
				<div class="uppercase font-bold w-full">Lockup period</div>
				<div
					use:hoverHint={{
						text: 'Lock your HiNATA for longer for better rewards!',
						targetId: 'hint-target'
					}}
				>
					<div id="hint-target" />
					<HorizontailOptionSwitcher
						on:StakeDurationUpdated={(e) => (selectedDuration = e.detail)}
						selected={selectedDuration}
						options={stakeDurationOptions}
						defaultOptionIndex={1}
					/>
				</div>
			</div>

			<p class="mt-8">
				Deposit your tokens to the vault to earn governance rewards and become a DAO member
			</p>
		</div>

		<!-- horizontal line -->
		<div class="w-full h-px bg-black bg-opacity-20 mt-7" />

		<div class="w-full pt-12 text-left pl-32 pr-16 max-w-3xl mx-auto">
			<div class="font-bold uppercase">Your vault balance</div>

			<div class="grid grid-cols-2 place-items-center">
				<div class="font-semibold w-full pl-8">
					{parseFloat($stakedHinataBalance.toFixed(2))} HiNATA TOKENS
				</div>
				<Button
					rounded
					gradient
					class="bg-gradient-to-r from-gray-300 to-transparent font-semibold text-[#777575]"
					on:click={claimWaifuRewards}
					disabled={$stakingWaifuRewards <= 0}
				>
					Claim
				</Button>
			</div>

			<div class="grid grid-cols-2 place-items-center mt-4">
				<div />
				<div class="uppercase">{parseFloat($stakingWaifuRewards.toFixed(2))} Waifu</div>
			</div>

			<p class="mt-8">
				Use your governance rewards to create proposals and vote at
				<a href="https://snapshot.org/#/hinatadao.eth" target="_blank" class="font-semibold">
					https://snapshot.org/#/hinatadao.eth
				</a>
				as well as claim exclusive NFTs on
				<a href="https://www.hinata.io/drops" target="_blank" class="font-semibold"
					>https://www.hinata.io/drops</a
				>.
				<a href="/airdrop" class="font-bold">READ MORE</a>
			</p>
		</div>
	</div>

	<div class="border-[1px] mt-32 max-w-5xl mx-auto" />
{:else}
	<div
		class="w-full max-w-5xl m-auto bg-black bg-opacity-5 container border-4 border-black px-4 border-opacity-20 mt-12 py-11 rounded-2xl"
	>
		<div class="text-4xl text-color-black font-bold">Claim your tokens</div>

		<div class="flex items-center justify-center mt-8">
			<ThemedCross />
			<div class="font-bold ml-4">Your ethereum address is not eligible for this airdrop.</div>
		</div>
	</div>
{/if}
