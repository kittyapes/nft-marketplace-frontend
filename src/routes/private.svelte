<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';

	import GridOptionContainer from '$lib/components/airdrop/investors/GridOptionContainer.svelte';
	import GridOptionSplit from '$lib/components/airdrop/investors/GridOptionSplit.svelte';
	import Button from '$lib/components/Button.svelte';
	import HorizontailOptionSwitcher from '$lib/components/HorizontailOptionSwitcher.svelte';
	import {
		privateClaimsArray,
		seedClaimsArray,
		seedEscrowUnlock,
		privateEscrowUnlock,
		appSigner,
		currentUserAddress,
		userHinataBalance,
		seedMerkleContractIsActive,
		privateMerkleContractIsActive,
		idoMerkleContractIsActive,
		stakingWaifuRewards,
		stakedHinataBalance,
		idoClaimsArray,
		idoEscrowUnlock,
		hinataStakingAllowance,
		communityClaimsArray
	} from '$stores/wallet';
	import { checkClaimEligibility } from '$utils/contracts/airdropDistribution';
	import { claimWaifuRewards, stakeTokens } from '$utils/contracts/staking';
	import daysFromNow from '$utils/daysFromNow';
	import { setPopup } from '$utils/popup';
	import axios from 'axios';
	import { ethers } from 'ethers';
	import { onMount } from 'svelte';
	import ProceedStakePopup from '$lib/components/airdrop/ProceedStakePopup.svelte';
	import { hinataTokensBalance, increaseHinataAllowance } from '$utils/contracts/tokenBalances';
	import { notifyError } from '$utils/toast';
	import { hoverHint } from '$actions/hoverHint';
	import LoadedContent from '$lib/components/LoadedContent.svelte';
	import AccessForbidden from '$lib/components/AccessForbidden.svelte';

	// Access to private route
	let accessAllowed = null;

	const checkAccessibilityOfRoute = (userAddress: string) => {
		const balanceAccess =
			$userHinataBalance > 0 ||
			seedClaimAmt > 0 ||
			seedEscrowed > 0 ||
			$communityClaimsArray?.length > 0 ||
			$stakingWaifuRewards > 0 ||
			$stakedHinataBalance > 0 ||
			privateClaimAmt > 0 ||
			privateEscrowed > 0 ||
			idoClaimAmount > 0 ||
			idoEscrowed > 0;

		accessAllowed = true;
		// TODO: REACTIVATE THIS WITH UPDATED LIST OF ACCESS INDIVIDUALS
		// userAddress &&
		// 	axios
		// 		.get(`/api/private-access?address=${userAddress}`)
		// 		.then((res) => {
		// 			if (!res.data.canAccess && !balanceAccess) {
		// 				notifyError('You are not allowed to access this page');
		// 				accessAllowed = false;
		// 			} else {
		// 				accessAllowed = true;
		// 			}
		// 		})
		// 		.catch((_err) => {
		// 			// browser && goto('/');
		// 		});
	};

	$: browser && checkAccessibilityOfRoute($currentUserAddress);

	onMount(() => checkAccessibilityOfRoute($currentUserAddress));

	// Quick and dirty
	// Private
	let privateClaimAmt = 0;
	let privateEscrowed = 0;
	let privateHasClaimed = false;
	let privateHasLoaded = false;
	const updatePrivateValues = (claims: ClaimsObject[]) => {
		if (claims) {
			privateHasClaimed =
				$privateClaimsArray?.filter((claimsObj) => claimsObj.user.hasClaimed).length ===
				$privateClaimsArray?.length;
			if (privateHasClaimed) {
				privateClaimAmt = 0;
				privateEscrowed = 0;
			} else {
				privateClaimAmt = 0;
				$privateClaimsArray.map((claimsObj) => {
					if (!claimsObj.user.hasClaimed && claimsObj.nextClaimDuration <= 0) {
						privateClaimAmt += +ethers.utils.formatEther(claimsObj.user.amount);
					} else if (!claimsObj.user.hasClaimed && claimsObj.nextClaimDuration > 0) {
						// Remaining escrowed tokens
						privateEscrowed += +ethers.utils.formatEther(claimsObj.user.amount);
					}
				});
			}
		}

		// TODO: CHANGE THIS ONCE PRIVATE CONTRACT IS LIVE
		privateHasLoaded = true;
	};

	$: updatePrivateValues($privateClaimsArray);

	// Seed
	let seedClaimAmt = 0;
	let seedEscrowed = 0;
	let seedHasClaimed = false;
	let seedHasLoaded = false;
	const seedUpdateValues = (claims: ClaimsObject[]) => {
		if (claims) {
			seedHasClaimed =
				$seedClaimsArray?.filter((claimsObj) => claimsObj.user.hasClaimed).length ===
				$seedClaimsArray?.length;
			if (seedHasClaimed) {
				seedClaimAmt = 0;
				seedEscrowed = 0;
			} else {
				seedClaimAmt = 0;
				$seedClaimsArray.map((claimsObj) => {
					if (!claimsObj.user.hasClaimed && claimsObj.nextClaimDuration <= 0) {
						seedClaimAmt += +ethers.utils.formatEther(claimsObj.user.amount);
					} else if (!claimsObj.user.hasClaimed && claimsObj.nextClaimDuration > 0) {
						// Remaining escrowed tokens
						seedEscrowed += +ethers.utils.formatEther(claimsObj.user.amount);
					}
				});
			}
		}

		// TODO: CHANGE THIS ONCE SEED CONTRACT IS LIVE
		seedHasLoaded = true;
	};

	$: seedUpdateValues($seedClaimsArray);

	// IDO or Public Airdrop
	let idoClaimAmount = 0;
	let idoEscrowed = 0;
	let idoPublicHasClaimed = false;
	let idoHasLoaded = false;
	const idoUpdateValues = (claims: ClaimsObject[]) => {
		if (claims) {
			idoPublicHasClaimed =
				$idoClaimsArray?.filter((claimsObj) => claimsObj.user.hasClaimed).length ===
				$idoClaimsArray?.length;

			if (idoPublicHasClaimed) {
				idoClaimAmount = 0;
				idoEscrowed = 0;
			} else {
				idoClaimAmount = 0;
				$idoClaimsArray.map((claimsObj) => {
					if (!claimsObj.user.hasClaimed && claimsObj.nextClaimDuration <= 0) {
						idoClaimAmount += +ethers.utils.formatEther(claimsObj.user.amount);
					} else if (!claimsObj.user.hasClaimed && claimsObj.nextClaimDuration > 0) {
						// Remaining escrowed tokens
						idoEscrowed += +ethers.utils.formatEther(claimsObj.user.amount);
					}
				});
			}
		}

		// TODO: CHANGE THIS ONCE IDO CONTRACT IS LIVE
		idoHasLoaded = true;
	};
	$: idoUpdateValues($idoClaimsArray);

	$: parsedIdoEscrowUnlockDate = ((dateObj: {
		days: number;
		hours: number;
		minutes: number;
		seconds: number;
	}) => {
		return dateObj ? `${dateObj.days}D ${dateObj.hours}H ${dateObj.minutes}M` : 'N/A';
	})(daysFromNow($idoEscrowUnlock));

	$: parsedSeedEscrowUnlockDate = ((dateObj: {
		days: number;
		hours: number;
		minutes: number;
		seconds: number;
	}) => {
		return dateObj ? `${dateObj.days}D ${dateObj.hours}H ${dateObj.minutes}M` : 'N/A';
	})(daysFromNow($seedEscrowUnlock));

	$: parsedPrivateEscrowUnlockDate = ((dateObj: {
		days: number;
		hours: number;
		minutes: number;
		seconds: number;
	}) => {
		return dateObj ? `${dateObj.days}D ${dateObj.hours}H ${dateObj.minutes}M` : 'N/A';
	})(daysFromNow($privateEscrowUnlock));

	let splitOptions: PrivatePageSplitOptions[];
	$: splitOptions = [
		{
			title: 'Seed',
			nextEscrowUnlock: parsedSeedEscrowUnlockDate,
			claimTokensValue: seedClaimAmt,
			escrowTokensValue: seedEscrowed,
			airdropType: 'seed',
			airdropHasClaimed: seedHasClaimed,
			contractActive: $seedMerkleContractIsActive
		},
		{
			title: 'Private',
			nextEscrowUnlock: parsedPrivateEscrowUnlockDate,
			claimTokensValue: privateClaimAmt,
			escrowTokensValue: privateEscrowed,
			airdropType: 'private',
			airdropHasClaimed: privateHasClaimed,
			contractActive: $privateMerkleContractIsActive
		},
		{
			title: 'Public',
			nextEscrowUnlock: parsedIdoEscrowUnlockDate,
			claimTokensValue: idoClaimAmount,
			escrowTokensValue: idoEscrowed,
			airdropType: 'ido',
			airdropHasClaimed: idoPublicHasClaimed,
			contractActive: $idoMerkleContractIsActive
		}
	];

	// Check For eligibility
	// Fetch for all
	const fetchAll = (userAddress: string) => {
		['seed', 'ido', 'private'].map((item: 'ido' | 'seed' | 'private') => {
			checkClaimEligibility(item, userAddress);
		});
	};

	$: (async (signer) => {
		return browser && signer && fetchAll(await signer.getAddress());
	})($appSigner);

	$: (async (address) => address && fetchAll(address))($currentUserAddress);

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
</script>

<LoadedContent
	loaded={accessAllowed !== null &&
		$userHinataBalance !== null &&
		privateHasLoaded &&
		seedHasLoaded &&
		idoHasLoaded}
>
	{#if accessAllowed}
		<div class="w-full px-6 min-h-screen">
			<div class="w-full flex justify-center mt-24">
				<img src="/img/logo/airdrop-logo.svg" alt="airdrop logo" />
			</div>

			<div class="w-full text-center mt-9 ">
				<div
					class="text-7xl uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-color-purple to-color-blue"
				>
					Investor portal
				</div>

				<div class="font-bold text-5xl mt-8">Private and public rounds</div>

				<div class="mt-16">
					If your wallet has a balance for the private or public HiNATA rounds you will be able to
					interact with this page
				</div>
			</div>

			<div
				class="w-full max-w-5xl mx-auto mt-16 mb-24 bg-color-black bg-opacity-5 border-2 rounded-2xl border-color-black border-opacity-10"
			>
				<!-- Table header -->
				<div
					class="
				flex items-center
				text-2xl
				border-b-2 border-color-black border-opacity-10
			"
				>
					<div
						class="w-2/5 h-full opacity-80 font-bold text-[#807070]
					border-r-2 border-color-black border-opacity-10
					flex items-center pl-14 pt-12 pb-8"
					>
						Balances
					</div>
					<div
						class="w-3/5 flex-grow opacity-80 text-black text-4xl text-center font-semibold pt-12 pb-8"
					>
						Claim your tokens
					</div>
				</div>

				{#each splitOptions as option}
					<GridOptionSplit {...option} />
				{/each}

				<!-- Wallet staking section -->
				<GridOptionContainer
					title="Wallet"
					hinataValue={parseFloat($userHinataBalance.toFixed(2)).toString()}
				>
					<div class="grid grid-cols-2 place-items-center gap-x-14">
						<div style="font-weight: 450;" class="w-full pl-4">
							{parseFloat($userHinataBalance.toFixed(2))} HINATA TOKENS
						</div>
						<Button
							gradient
							rounded
							on:click={() =>
								$hinataStakingAllowance > 0 ? stakeAllTokens() : increaseHinataAllowance()}
							disabled={$userHinataBalance <= 0}
							>{$hinataStakingAllowance > 0 ? 'Stake' : 'Approve'}</Button
						>
					</div>

					<div class="flex mt-8 items-center gap-x-14">
						<div class="uppercase font-bold">Lockup period</div>
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
				</GridOptionContainer>

				<!-- Vault claim section -->
				<GridOptionContainer
					title="Vault"
					hinataValue={parseFloat($stakedHinataBalance.toFixed(2)).toString()}
				>
					<div class="grid grid-cols-2 place-items-center gap-x-14">
						<div style="font-weight: 450;" class="w-full pl-4">
							{parseFloat($stakingWaifuRewards.toFixed(2))} WAIFU
						</div>
						<Button
							gradient
							rounded
							on:click={claimWaifuRewards}
							disabled={$stakingWaifuRewards <= 0}>Claim</Button
						>
					</div>

					<p class="mt-8">
						Use your governance rewards to create proposals and vote at
						<a href="https://snapshot.org/#/hinatadao.eth" class="font-semibold">
							https://snapshot.org/#/hinatadao.eth
						</a>
						as well as claim exclusive NFTs on
						<a href="https://www.hinata.io/drops" class="font-semibold">
							https://www.hinata.io/drops
						</a>
						.
						<a href="/private" class="font-bold">READ MORE</a>
					</p>
				</GridOptionContainer>
			</div>
		</div>
	{:else}
		<AccessForbidden />
	{/if}
</LoadedContent>
