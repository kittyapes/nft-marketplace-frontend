<script lang="ts">
	import ActionButton from './ActionButton.svelte';
	import Table from './Table.svelte';
	import type { Position } from './types';

	export let positions: Position[] = [];
</script>

<div class="mt-4">
	<Table>
		<div slot="headers">
			<div>Time Left</div>
			<div>Amount</div>
			<div>APY</div>
		</div>

		<div slot="data">
			{#each positions as pos}
				<div>
					{#if pos.unstakeAvailable}
						<ActionButton>Unstake</ActionButton>
					{:else}
						{pos.timeLeft}
					{/if}
				</div>
				<div>{pos.amount}</div>
				<div>{pos.APY}</div>
			{/each}
		</div>
	</Table>
</div>
