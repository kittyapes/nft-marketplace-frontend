<script lang="ts">
	import Table from './Table.svelte';
	import type { Position } from './types';
	import dayjs from 'dayjs';
	import { createEventDispatcher } from 'svelte';
	import { ethers } from 'ethers';

	const dispatch = createEventDispatcher();

	export let positions: Position[] = [];
	export let highlightItems = false;

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
			{#each positions as pos, index}
				{#if !ethers.utils.parseEther(pos.amount).eq(ethers.utils.parseEther('0'))}
					<div
						class="table_item"
						on:click={() => unstake(pos.stakeId, pos.amount)}
						class:highlight={highlightItems}
						style="animation-delay: {index * 100}ms"
					>
						<div>
							{#if pos.unstakeAvailable}
								<!-- <ActionButton on:click={() => unstake(pos.stakeId, pos.amount)}>Unstake</ActionButton> -->
								0 days
							{:else}
								{dayjs(pos.endTime).fromNow(true)}
							{/if}
						</div>
						<div>{pos.amount}</div>
						<div>{isFinite(pos.aprOrApy) ? pos.aprOrApy : 0}%</div>
					</div>
				{/if}
			{/each}
		</div>
	</Table>
</div>

<style lang="postcss">
	div.highlight {
		animation: flash 1500ms infinite ease-in;
	}

	@keyframes flash {
		0% {
			background: transparent;
			box-shadow: none;
		}

		50% {
			background: linear-gradient(
					56.67deg,
					rgba(167, 148, 255, 0) 11.15%,
					rgba(167, 148, 255, 0.5115) 57.47%,
					rgba(142, 119, 247, 0) 127.41%,
					rgba(142, 119, 247, 0) 127.41%,
					rgba(167, 148, 255, 0) 127.41%
				),
				rgba(103, 212, 248, 0.55);
			/* Text Glow - Blue */
			box-shadow: 0px 0px 3px #299bff;
		}

		100% {
			background: transparent;
			box-shadow: none;
		}
	}
</style>
