<script lang="ts">
	import Button from '../Button.svelte';
	import { fade } from 'svelte/transition';
	import { merkleContractIsActive, userClaimsArray, userHinataBalance } from '$stores/wallet';
	import { ethers } from 'ethers';
	import { claimAirdropTokens } from '$utils/wallet/airdropDistribution';
	import HorizontailOptionSwitcher from '../HorizontailOptionSwitcher.svelte';
	import Hint from '../Hint.svelte';
	import ThemedCross from '$icons/themed-cross.svelte';

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

	const stakeDurationOptions = [{ label: '3MO' }, { label: '1YR' }, { label: '2YR' }];

	let stakeDurationHovered = false;
</script>

{#if claimAmount > 0}
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

			<div class="font-bold uppercase mt-7">YOU WILL RECIEVE...</div>

			<div class="w-full flex flex-col gap-4 mt-5">
				<div class="w-96 flex justify-between items-center mx-auto">
					<span class="font-bold tracking-wider w-3/5">{claimAmount} HINATA TOKENS</span>
					<div class="w-36">
						<Button
							gradient
							rounded
							on:click={() =>
								!(!$merkleContractIsActive || hasClaimed || claimAmount <= 0) &&
								claimAirdropTokens()}
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
								Claim
							{/if}
						</Button>
					</div>
				</div>

				<div class="w-96 flex justify-between items-center mx-auto">
					<span class="font-bold tracking-wider w-3/5">14,204 HINATA TOKENS</span>
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
					<div class="text-xl font-bold w-36">29D, 4H, 17M</div>
				</div>
			</div>
		</div>

		<!-- horizontal line -->
		<div class="w-full h-px bg-black bg-opacity-20 mt-7" />

		<div class="w-full pt-12 text-left pl-32 pr-16 max-w-3xl mx-auto">
			<div class="font-bold uppercase">Your wallet balance</div>

			<div class="grid grid-cols-2 place-items-center">
				<div class="font-semibold w-full pl-8">14,203 HINATA TOKENS</div>
				<Button rounded gradient>Stake</Button>
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
								<a href="./private" class="font-bold"> READ MORE </a>
							</Hint>
						</div>
					{/if}

					<HorizontailOptionSwitcher options={stakeDurationOptions} defaultOptionIndex={1} />
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
				<div class="font-semibold w-full pl-8">14,203 HINATA TOKENS</div>
				<Button
					rounded
					class="bg-gradient-to-r from-gray-300 to-transparent font-semibold text-[#777575]"
				>
					Claim
				</Button>
			</div>

			<div class="grid grid-cols-2 place-items-center mt-4">
				<div />
				<div class="uppercase">17.2933921 Waifu</div>
			</div>

			<p class="mt-8">
				Use your governance rewards to create proposals and vote at
				<a href="https://snapshot.org/#/hinatadao.eth" class="font-semibold">
					https://snapshot.org/#/hinatadao.eth
				</a>
				as well as claim exclusive NFTs on
				<a href="https://www.hinata.io/drops" class="font-semibold">https://www.hinata.io/drops</a>.
				<a href="./airdrop" class="font-bold">READ MORE</a>
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
