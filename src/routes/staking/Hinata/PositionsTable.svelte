<script lang="ts">
	import ActionButton from './ActionButton.svelte';
	import Table from './Table.svelte';
	import type { Position } from './types';
	import dayjs from 'dayjs';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let positions: Position[] = [];

	function unstake(stakeId: number, amount: string) {
		dispatch('unstake-tokens', { amount: amount, stakeId: stakeId });
	}
</script>

<div class="mt-4">
	<Table>
		<div slot="headers">
			<div>Time Left</div>
			<div>Amount</div>
			<div>APY/APR</div>
		</div>

		<div slot="data">
			{#each positions as pos}
				<div>
					{#if pos.unstakeAvailable}
						<ActionButton on:click={() => unstake(pos.stakeId, pos.amount)}>Unstake</ActionButton>
					{:else}
						{dayjs(pos.endTime).fromNow(true)}
					{/if}
				</div>
				<div>{pos.amount}</div>
				<div>{isFinite(pos.aprOrApy) ? pos.aprOrApy : 0}%</div>
			{/each}
		</div>
	</Table>
</div>
