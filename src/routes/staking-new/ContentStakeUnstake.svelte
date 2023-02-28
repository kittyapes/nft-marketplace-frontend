<script lang="ts">
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import HiContentStakeUnstake from './HiContentStakeUnstake.svelte';
	import LpContentStakeUnstake from './LpContentStakeUnstake.svelte';

	let selectedToken: 'hinata' | 'hinata-lp' = 'hinata-lp';
</script>

<div class="gap-12 flex">
	<!-- Choose Tokens To Stake -->
	<div class="w-80">
		<div class="text-lg">Choose Tokens To Stake</div>

		<div class="flex gap-y-4 flex-col mt-4">
			<PrimaryButton
				selected={selectedToken === 'hinata'}
				on:click={() => (selectedToken = 'hinata')}
			>
				HINATA
			</PrimaryButton>

			<PrimaryButton
				selected={selectedToken === 'hinata-lp'}
				on:click={() => (selectedToken = 'hinata-lp')}
			>
				HINATA LP
			</PrimaryButton>
		</div>
	</div>

	<!-- Content -->
	{#if selectedToken === 'hinata'}
		<HiContentStakeUnstake />
	{:else}
		<LpContentStakeUnstake />
	{/if}
</div>
