<script lang="ts">
	import LoadedContent from '$lib/components/LoadedContent.svelte';
	import Container from '$lib/components/staking/Container.svelte';
	import FooterInfo from '$lib/components/staking/FooterInfo.svelte';
	import HeaderInfo from '$lib/components/staking/HeaderInfo.svelte';
	import RewardsToCollect from '$lib/components/staking/RewardsToCollect.svelte';
	import TradingRewards from '$lib/components/staking/TradingRewards.svelte';
	import { walletRefreshed } from '$utils/wallet';

	export let hinataPerDay = 369.0;
	export let waifuPerDay = 123.0;
	export let annualPercentageReturn = 195.4;

	let currency: 'HiNATA' | 'HiNATA-LP' = 'HiNATA';
</script>

<LoadedContent loaded={$walletRefreshed}>
	<div class="w-full grid place-items-center">
		<div class="p-10 w-5/6 h-full flex flex-col gap-10">
			<HeaderInfo {hinataPerDay} {waifuPerDay} {annualPercentageReturn} />
			<div class="flex flex-col">
				<div class="flex gap-20 w-full">
					<div class="flex flex-col gap-8 w-1/3">
						<div class="text-color-black text-xl  font-semibold">Choose tokens to stake</div>
						<div class="flex gap-7">
							<button class="btn-primary text-lg w-1/2 font-semibold">hinata</button>
							<button class="btn btn-rounded uppercase w-1/2  gradient-border ">
								<div class="gradient-text text-lg font-semibold">Hinata LP</div>
							</button>
						</div>
						<div class="flex flex-col">
							<div class="flex font-semibold text-2xl gap-2">
								<div class="gradient-text">{currency}</div>
								<div>Staking</div>
							</div>
							<div class="flex font-semibold text-lg gap-2">
								<div>Stake HiNATA</div>
								<div>|</div>
								<div>Earn WAIFU</div>
							</div>
						</div>
					</div>
					<div class="w-2/3">
						<Container class={$$props.class}>
							<div class="w-full flex flex-col gap-2">
								<div class="flex">
									<div class="flex-grow" />
								</div>
								<div class="flex w-full gap-6 relative">
									<input class="input border-black w-full font-semibold text-lg px-8" readonly />
									<button class="btn btn-rounded btn-gradient font-semibold">Collect</button>
								</div>
							</div>
						</Container>
					</div>
				</div>
			</div>
			<RewardsToCollect />
			<hr class="separator" />
			<TradingRewards />
			<hr class="separator" />
			<FooterInfo />
		</div>
	</div>
</LoadedContent>

<style lang="postcss">
	.gradient-border {
		background: linear-gradient(white, white) padding-box,
			linear-gradient(to right, #868bf7, #6cc7f8) border-box;
		@apply border-transparent border;
	}
</style>
