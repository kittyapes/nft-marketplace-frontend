<script lang="ts">
	import ActionButton from './ActionButton.svelte';
	import Table from './Table.svelte';
	import type { Position } from './types';
	import dayjs from 'dayjs';

	export let positions: Position[] = [];
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
						<ActionButton>Unstake</ActionButton>
					{:else}
						{dayjs(pos.endTime).fromNow(true)}
					{/if}
				</div>
				<div>{pos.amount}</div>
				<div>{pos.aprOrApy}%</div>
			{/each}
		</div>
	</Table>
</div>
