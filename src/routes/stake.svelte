<script lang="ts">
	import LoadedContent from '$lib/components/LoadedContent.svelte';
	import Container from '$lib/components/staking/Container.svelte';
	import FooterInfo from '$lib/components/staking/FooterInfo.svelte';
	import HeaderInfo from '$lib/components/staking/HeaderInfo.svelte';
	import RewardsToCollect from '$lib/components/staking/RewardsToCollect.svelte';
	import { walletRefreshed } from '$utils/wallet';
	import type { TradingRewards } from 'src/interfaces/stake/tradingRewards';
	import type { CollectableRewards } from 'src/interfaces/stake/collectableRewards';
	import { fade } from 'svelte/transition';
	import TradingRewardsDisplay from '$lib/components/staking/TradingRewardsDisplay.svelte';

	export let hinataPerDay = 369.0;
	export let hinataInWallet = 500;
	export let hinataLpInWallet = 500;
	export let waifuPerDay = 123.0;
	export let annualPercentageReturn = 195.4;
	export let tradingRewards: TradingRewards = {
		rewards: 500,
		hoursToCollect: 3,
		totalVolume: 1862,
		totalRewards: 5184,
		nextRewardDate: '12 hours 20 min'
	};
	export let hinataRewards: CollectableRewards = {
		collectionAmount: 5000,
		lastCollected: 369,
		collectedToDate: '26.2.2022',
		earnedToDate: 5600003.55,
		rewardCurrency: 'HiNATA'
	};
	export let hinataLpRewards: CollectableRewards[] = [
		{
			collectionAmount: 1000,
			lastCollected: 369,
			collectedToDate: '26.2.2022',
			earnedToDate: 5600003.55,
			rewardCurrency: 'HiNATA'
		},
		{
			collectionAmount: 1000,
			lastCollected: 369,
			collectedToDate: '26.2.2022',
			earnedToDate: 5600003.55,
			rewardCurrency: 'WAIFU'
		}
	];

	let currency: 'HiNATA' | 'HiNATA-LP' = 'HiNATA';
	let mode: 'stake' | 'unstake' = 'stake';
</script>

<LoadedContent loaded={$walletRefreshed}>
	<div class="w-full grid place-items-center">
		<div class="p-10 w-5/6 h-full flex flex-col gap-10">
			<HeaderInfo {hinataPerDay} {waifuPerDay} {annualPercentageReturn} />
			<div class="flex flex-col">
				<div class="grid grid-cols-[2fr_3fr] gap-20 w-full">
					<div class="flex flex-col gap-8">
						<div class="text-color-black text-xl font-semibold">Choose tokens to stake</div>
						<div class="flex gap-3 ">
							<button class="w-1/2 {currency === 'HiNATA' ? 'btn-primary' : 'btn btn-rounded uppercase gradient-border'}" on:click={() => (currency = 'HiNATA')}>
								<div class="text-lg font-semibold transition-colors {currency === 'HiNATA' ? '' : 'gradient-text'}">hinata</div>
							</button>
							<button class="w-1/2  {currency === 'HiNATA-LP' ? 'btn-primary' : 'btn btn-rounded uppercase gradient-border'}" on:click={() => (currency = 'HiNATA-LP')}>
								<div class="text-lg font-semibold transition-colors {currency === 'HiNATA-LP' ? '' : 'gradient-text'}">Hinata LP</div>
							</button>
						</div>
						<div class="flex flex-col">
							<div class="flex font-semibold text-2xl gap-2">
								<div class="gradient-text">{currency}</div>
								<div>Staking</div>
							</div>
							{#if currency === 'HiNATA'}
								<div class="flex font-semibold text-lg gap-2" in:fade>
									<div>Stake HiNATA</div>
									<div>|</div>
									<div>Earn WAIFU</div>
								</div>
							{:else}
								<div class="flex font-semibold text-lg gap-2" in:fade>
									<div>Stake HiNATA-LP</div>
									<div>|</div>
									<div>Earn WAIFU</div>
									<div>|</div>
									<div>Earn HiNATA</div>
								</div>
							{/if}
						</div>
					</div>
					<div class="w-full">
						<div class="px-8 font-semibold text-lg place-self-center">Your Stake</div>
						<Container class={$$props.class}>
							<div class="w-full flex flex-col gap-4">
								<div class="flex w-2/3 text-lg">
									<button
										class="btn btn-gradient active:scale-100 px-4 py-3 w-[40%] rounded-l-md border-r-0 transition-opacity {mode === 'stake'
											? 'border-transparent bg-gradient-to-r from-color-purple to-color-blue'
											: 'gradient-border'}"
										on:click={() => (mode = 'stake')}
									>
										<div class="transition-colors font-semibold text-center {mode === 'stake' ? '' : 'gradient-text'}">Stake</div>
									</button>
									<button
										class="btn btn-gradient active:scale-100 px-4 py-3 w-[40%] rounded-r-md transition-opacity {mode === 'unstake'
											? 'border-transparent bg-gradient-to-r from-color-purple to-color-blue'
											: 'gradient-border'}"
										on:click={() => (mode = 'unstake')}
									>
										<div class="transition-colors font-semibold text-center {mode === 'unstake' ? '' : 'gradient-text'}">Unstake</div>
									</button>
								</div>
								<div class="flex w-full gap-6 relative items-center">
									<div class="w-full relative">
										<input class="input border-black w-full font-semibold text-lg  relative" />
										<div class="text-lg text-color-gray-light absolute right-4 top-2">Max</div>
									</div>
									{#if mode === 'stake'}
										<button class="btn btn-rounded btn-gradient font-semibold w-[25%]" in:fade>Stake</button>
									{:else}
										<button class="btn btn-rounded btn-gradient font-semibold w-[25%]" in:fade>Unstake</button>
									{/if}
								</div>
								<div class="flex flex-col">
									<div class="flex font-semibold text-2xl gap-2 w-full items-center">
										<div class="gradient-text ">${currency}</div>
										<div>Wallet Balance:</div>
										<div class="text-lg font-semibold">
											{#if currency === 'HiNATA'}
												{hinataInWallet}
											{:else}
												{hinataLpInWallet}
											{/if}
										</div>
									</div>
									<div class="font-semibold">Your Stake (Compounding)</div>
								</div>
							</div>
						</Container>
					</div>
				</div>
			</div>

			{#if currency === 'HiNATA'}
				<RewardsToCollect {...hinataRewards} />
			{:else}
				{#each hinataLpRewards as reward}
					<RewardsToCollect {...reward} />
				{/each}
			{/if}
			<hr class="separator" />
			<TradingRewardsDisplay {...tradingRewards} />
			<hr class="separator" />
			<FooterInfo />
		</div>
	</div>
</LoadedContent>

<style lang="postcss">
	.gradient-border {
		background: linear-gradient(white, white) padding-box, linear-gradient(to right, #868bf7, #6cc7f8) border-box;
		@apply border-transparent border-2;
	}
</style>
