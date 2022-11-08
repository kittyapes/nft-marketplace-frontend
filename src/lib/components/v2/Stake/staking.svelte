<script lang="ts">
	import LoadedContent from '$lib/components/LoadedContent.svelte';
	import RewardsToCollect from '$lib/components/v2/Stake/RewardsToCollect.svelte';
	import Trading from './Trading.svelte';
	import Marketing from './Marketing.svelte';
	import StakeSection from './StakeSection.svelte';
	import Stats from './Stats.svelte';
	import TradingRewards from './TradingRewards.svelte';
	let apr: number;
	let dailyHinata: number;
	let dailyWaifu: number;
	let token: 'HINATA' | 'HINATA LP';
	let action: 'STAKE' | 'UNSTAKE';
	let hinataWalletBalance: number;
</script>

<LoadedContent>
	<div class="px-36 pb-36 text-white">
		<Stats bind:apr bind:dailyHinata bind:dailyWaifu />
		<StakeSection bind:token bind:action bind:hinataWalletBalance />
		<RewardsToCollect bind:token />
		<TradingRewards />
		<Marketing />
		<Trading />
	</div>
</LoadedContent>
