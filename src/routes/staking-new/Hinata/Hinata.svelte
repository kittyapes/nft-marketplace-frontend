<script lang="ts">
	import Stake from './Stake.svelte';
	import StakeUnstakeSwitch from './StakeUnstakeSwitch.svelte';
	import Unstake from './Unstake.svelte';

	let stateStakeUnstake: 'stake' | 'unstake' = 'stake';
</script>

<div class="flex-grow">
	<div class="text-lg">Your Stake</div>

	<StakeUnstakeSwitch bind:state={stateStakeUnstake} />

	{#if stateStakeUnstake === 'stake'}
		<Stake />
	{:else}
		<Unstake />
	{/if}
</div>
