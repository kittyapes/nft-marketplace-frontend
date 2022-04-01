<script lang="ts">
	import LoadedContent from '$lib/components/LoadedContent.svelte';
	import FooterInfo from '$lib/components/staking/FooterInfo.svelte';
	import HeaderInfo from '$lib/components/staking/HeaderInfo.svelte';
	import RewardsToCollect from '$lib/components/staking/RewardsToCollect.svelte';
	import TradingRewards from '$lib/components/staking/TradingRewards.svelte';
	import { walletRefreshed } from '$utils/wallet';

	export let hinataPerDay = 369;
	export let waifuPerDay = 123;
	export let annualPercentageReturn = 195.4;
</script>

<LoadedContent loaded={$walletRefreshed}>
	<div class="w-full grid place-items-center">
		<div class="p-10 w-5/6 h-full">
			<HeaderInfo {hinataPerDay} {waifuPerDay} {annualPercentageReturn} />
			<RewardsToCollect />
			<hr class="border-t border-color-gray-base border-opacity-50" />
			<TradingRewards />
			<hr class="border-t border-color-gray-base border-opacity-50" />
			<FooterInfo />
		</div>
	</div>
</LoadedContent>
