<script lang="ts">
	import { browser } from '$app/env';

	import GridOptionContainer from '$lib/components/airdrop/investors/GridOptionContainer.svelte';
	import GridOptionSplit from '$lib/components/airdrop/investors/GridOptionSplit.svelte';
	import Button from '$lib/components/Button.svelte';
	import Hint from '$lib/components/Hint.svelte';
	import HorizontailOptionSwitcher from '$lib/components/HorizontailOptionSwitcher.svelte';
	import {
		privateClaimsArray,
		seedClaimsArray,
		publicClaimsArray,
		seedEscrowUnlock,
		privateEscrowUnlock,
		publicEscrowUnlock,
		appSigner,
		currentUserAddress,
		userHinataBalance,
		seedMerkleContractIsActive,
		privateMerkleContractIsActive,
		publicMerkleContractIsActive
	} from '$stores/wallet';
	import { checkClaimEligibility } from '$utils/contracts/airdropDistribution';
	import daysFromNow from '$utils/daysFromNow';
	import { ethers } from 'ethers';
	import { fade } from 'svelte/transition';

	// Quick and dirty
	// Private
	let privateClaimAmt = 0;
	let privateEscrowed = 0;
	let privateHasClaimed = false;
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
	};

	$: updatePrivateValues($seedClaimsArray);

	// Seed
	let seedClaimAmt = 0;
	let seedEscrowed = 0;
	let seedHasClaimed = false;
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
	};

	$: seedUpdateValues($seedClaimsArray);

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
			nextEscrowUnlock: parsedPublicEscrowUnlockDate,
			claimTokensValue: publicClaimAmount,
			escrowTokensValue: publicEscrowed,
			airdropType: 'public',
			airdropHasClaimed: publicHasClaimed,
			contractActive: $publicMerkleContractIsActive
		}
	];

	// Check For eligibility
	// Fetch for all
	const fetchAll = (userAddress: string) => {
		['seed', 'public', 'private'].map((item: 'public' | 'seed' | 'private') => {
			checkClaimEligibility(item, userAddress);
		});
	};

	$: (async (signer) => {
		return browser && signer && fetchAll(await signer.getAddress());
	})($appSigner);

	$: (async (address) => address && fetchAll(address))($currentUserAddress);

	const stakeDurationOptions = [{ label: '3MO' }, { label: '1YR' }, { label: '2YR' }];

	let stakeDurationHovered = false;
</script>

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
		<GridOptionContainer title="Wallet" hinataValue={$userHinataBalance.toFixed(2)}>
			<div class="grid grid-cols-2 place-items-center gap-x-14">
				<div style="font-weight: 450;" class="w-full pl-4">
					{$userHinataBalance.toFixed(2)} HINATA TOKENS
				</div>
				<Button gradient rounded>Stake</Button>
			</div>

			<div class="flex mt-8 items-center gap-x-14">
				<div class="uppercase font-bold">Lockup period</div>
				<div
					on:mouseenter={() => (stakeDurationHovered = true)}
					on:mouseleave={() => (stakeDurationHovered = false)}
				>
					<HorizontailOptionSwitcher options={stakeDurationOptions} defaultOptionIndex={1} />
				</div>
			</div>

			<p class="mt-8">
				Deposit your tokens to the vault to earn governance rewards and become a DAO member
			</p>
		</GridOptionContainer>

		{#if stakeDurationHovered}
			<div
				class="w-0 translate-y-[-260px] translate-x-[470px]"
				transition:fade|local={{ duration: 100 }}
			>
				<Hint>
					Lock your HiNATA for longer for better rewards!
					<a href="./private" class="font-bold"> READ MORE </a>
				</Hint>
			</div>
		{/if}

		<!-- Vault claim section -->
		<GridOptionContainer title="Vault" hinataValue="14,203">
			<div class="grid grid-cols-2 place-items-center gap-x-14">
				<div style="font-weight: 450;" class="w-full pl-4 text-red-400">19.2938433 WAIFU</div>
				<Button gradient rounded>Claim</Button>
			</div>

			<p class="mt-8">
				Use your governance rewards to create proposals and vote at
				<a href="https://snapshot.org/#/hinatadao.eth" class="font-semibold">
					https://snapshot.org/#/hinatadao.eth
				</a>
				as well as claim exclusive NFTs on
				<a href="https://www.hinata.io/drops" class="font-semibold">
					https://www.hinata.io/drops
				</a>.
				<a href="./private" class="font-bold">READ MORE</a>
			</p>
		</GridOptionContainer>
	</div>
</div>
