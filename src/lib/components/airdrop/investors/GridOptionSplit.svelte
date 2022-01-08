<script lang="ts">
	import Button from '$lib/components/Button.svelte';

	export let title: string,
		nextEscrowUnlock: string,
		claimTokensValue: number,
		escrowTokensValue: number;
</script>

<div class="flex flex-row border-b-2 border-color-black border-opacity-10">
	<!-- Left Box -->
	<div class="w-2/5 p-14 text-color-black text-2xl border-r-2 border-color-black border-opacity-10">
		<div class="mt-6">{title}</div>
		<div class="ml-6 font-bold">{claimTokensValue + escrowTokensValue} HiNATA</div>
	</div>

	<!-- Rright box -->
	<div class="w-auto p-14">
		<div class="w-full grid grid-cols-2 grid-rows-3 mt-7 gap-x-14 gap-y-6">
			<div class="uppercase font-semibold text-xs self-center">Next escrow unlock is...</div>
			<div class="font-bold text-xl self self-center">{nextEscrowUnlock}</div>

			<div class="uppercase font-bold self-center">{claimTokensValue} HINATA TOKENS</div>
			<div><Button gradient rounded>CLAIM</Button></div>

			<div class="uppercase font-semibold self-center">{escrowTokensValue} HINATA TOKENS</div>
			<div>
				<Button rounded class="bg-gradient-to-r from-gray-300 to-transparent">Escrowed</Button>
			</div>
		</div>
	</div>
</div>
