<script lang="ts">
	import Button from '../Button.svelte';
	import { fade } from 'svelte/transition';
	import {
		publicMerkleContractIsActive,
		publicClaimsArray,
		userHinataBalance,
		publicEscrowUnlock,
		isAirdropClaiming
	} from '$stores/wallet';
	import { ethers } from 'ethers';
	import { claimAirdropTokens } from '$utils/contracts/airdropDistribution';
	import HorizontailOptionSwitcher from '../HorizontailOptionSwitcher.svelte';
	import Hint from '../Hint.svelte';
	import ThemedCross from '$icons/themed-cross.svelte';
	import daysFromNow from '$utils/daysFromNow';
	import { stakeTokens } from '$utils/contracts/staking';
	import { setPopup } from '$utils/popup';
import ProceedStakePopup from './ProceedStakePopup.svelte';

	let publicClaimAmount = 0;
	let publicEscrowed = 0;
	let publicHasClaimed = false;
	const publicUpdateValues = (claims: ClaimsObject[]) => {
		if (claims) {
			publicHasClaimed =
				$publicClaimsArray?.filter((claimsObj) => claimsObj.user.hasClaimed).length ===
				$publicClaimsArray?.length;
			if (publicHasClaimed) {
				publicClaimAmount = 0;
				publicEscrowed = 0;
			} else {
				publicClaimAmount = 0;
				$publicClaimsArray.map((claimsObj) => {
					if (!claimsObj.user.hasClaimed && claimsObj.nextClaimDuration <= 0) {
						publicClaimAmount += +ethers.utils.formatEther(claimsObj.user.amount);
					} else if (!claimsObj.user.hasClaimed && claimsObj.nextClaimDuration > 0) {
						// Remaining escrowed tokens
						publicEscrowed += +ethers.utils.formatEther(claimsObj.user.amount);
					}
				});
			}
		}
	};

	$: publicUpdateValues($publicClaimsArray);
	$: parsedPublicEscrowUnlockDate = ((dateObj: {
		days: number;
		hours: number;
		minutes: number;
		seconds: number;
	}) => {
		return dateObj ? `${dateObj.days}D ${dateObj.hours}H ${dateObj.minutes}M` : 'N/A';
	})(daysFromNow($publicEscrowUnlock));

	const stakeAllTokens = () => {
		setPopup(ProceedStakePopup, {
			props: {
				numberOfHinata: $userHinataBalance,
				duration: selectedDuration.label,
				onContinue: () => stakeTokens($userHinataBalance, selectedDuration.duration)
			}
		});
	};

	const stakeDurationOptions = [
		{ label: '3MO', duration: 7776000 },
		{ label: '1YR', duration: 31104000 },
		{ label: '2YR', duration: 62208000 }
	];

	let selectedDuration = stakeDurationOptions[1];

	let stakeDurationHovered = false;
</script>

{#if $userHinataBalance > 0 || publicClaimAmount > 0 || publicEscrowed > 0 || $publicClaimsArray?.length > 0}
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
						>{parseFloat(publicClaimAmount.toFixed(2))} HiNATA TOKENS</span
					>
					<div class="w-36">
						<Button
							gradient
							rounded
							on:click={() =>
								!(!$publicMerkleContractIsActive || publicHasClaimed || publicClaimAmount <= 0) &&
								claimAirdropTokens('public')}
							disabled={$isAirdropClaiming ||
								!$publicMerkleContractIsActive ||
								publicHasClaimed ||
								publicClaimAmount <= 0}
						>
							{#if $publicMerkleContractIsActive}
								{#if publicHasClaimed}
									Already Claimed
								{:else if !publicHasClaimed && publicClaimAmount > 0}
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
						>{parseFloat(publicEscrowed.toFixed(2))} HiNATA TOKENS</span
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
						{parsedPublicEscrowUnlockDate}
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
				<Button rounded gradient on:click={stakeAllTokens} disabled={$userHinataBalance <= 0}
					>Stake</Button
				>
			</div>

			<div class="grid grid-cols-2 place-items-center mt-16">
				<div class="uppercase font-bold w-full">Lockup period</div>
				<div
					on:mouseenter={() => (stakeDurationHovered = true)}
					on:mouseleave={() => (stakeDurationHovered = false)}
				>
					{#if stakeDurationHovered}
						<div
							class="translate-x-[-75%] translate-y-[-50px]"
							transition:fade|local={{ duration: 100 }}
						>
							<Hint>
								Lock your HiNATA for longer for better rewards!
								<a href="/private" class="font-bold"> READ MORE </a>
							</Hint>
						</div>
					{/if}

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
			<div class="font-bold uppercase">Your value balance</div>

			<div class="grid grid-cols-2 place-items-center">
				<div class="font-semibold w-full pl-8 text-red-400">14,203 HiNATA TOKENS</div>
				<Button
					rounded
					class="bg-gradient-to-r from-gray-300 to-transparent font-semibold text-[#777575]"
				>
					Claim
				</Button>
			</div>

			<div class="grid grid-cols-2 place-items-center mt-4">
				<div />
				<div class="uppercase text-red-400">17.2933921 Waifu</div>
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
