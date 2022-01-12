<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { isAirdropClaiming } from '$stores/wallet';
	import { claimAirdropTokens } from '$utils/contracts/airdropDistribution';

	export let title: string,
		nextEscrowUnlock: string,
		claimTokensValue: number,
		escrowTokensValue: number,
		airdropType: 'ido' | 'seed' | 'private',
		airdropHasClaimed: boolean,
		contractActive: boolean;
</script>

<div class="flex flex-row border-b-2 border-color-black border-opacity-10">
	<!-- Left Box -->
	<div class="w-2/5 p-14 text-color-black text-2xl border-r-2 border-color-black border-opacity-10">
		<div class="mt-6">{title}</div>
		<div class="ml-6 font-bold">
			{parseFloat((claimTokensValue + escrowTokensValue).toFixed(2))} HiNATA
		</div>
	</div>

	<!-- Rright box -->
	<div class="w-auto p-14">
		<div class="w-full grid grid-cols-2 grid-rows-3 mt-7 gap-x-14 gap-y-6">
			<div class="uppercase font-semibold text-xs self-center">Escrow unlock in...</div>
			<div class="font-bold text-xl self self-center">{nextEscrowUnlock}</div>

			<div class="uppercase font-bold self-center">
				{parseFloat(claimTokensValue.toFixed(2))} HINATA TOKENS
			</div>
			<div>
				<Button
					gradient
					rounded
					on:click={() =>
						!(!contractActive || airdropHasClaimed || claimTokensValue <= 0) &&
						claimAirdropTokens(airdropType)}
					disabled={$isAirdropClaiming ||
						!contractActive ||
						airdropHasClaimed ||
						claimTokensValue <= 0}>CLAIM</Button
				>
			</div>

			<div class="uppercase font-semibold self-center">
				{parseFloat(escrowTokensValue.toFixed(2))} HINATA TOKENS
			</div>
			<div>
				<Button rounded class="bg-gradient-to-r from-gray-300 to-transparent" disabled
					>Escrowed</Button
				>
			</div>
		</div>
	</div>
</div>
