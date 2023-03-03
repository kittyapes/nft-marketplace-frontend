<script lang="ts">
	import { claimStakingRewards } from '$utils/contracts/staking';
	import ActionButton from './ActionButton.svelte';
	import Table from './Table.svelte';
	import type { Reward } from './types';

	export let rewards: Reward[];
</script>

<div class="mt-4">
	<Table>
		<div slot="headers">
			<div>Token</div>
			<div>Amount</div>
			<div>Action</div>
		</div>

		<div slot="data">
			{#each rewards as reward}
				<div>
					{reward.token}
				</div>
				<div>{reward.amount}</div>
				<div>
					<ActionButton on:click={claimStakingRewards}>Claim</ActionButton>
				</div>
			{/each}
		</div>
	</Table>
</div>
