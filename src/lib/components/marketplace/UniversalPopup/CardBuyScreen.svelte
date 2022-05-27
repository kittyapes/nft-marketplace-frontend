<script lang="ts">
	export let currencySymbol: string;
	export let header: { info: string; amount: number; buttonText: string } = undefined;
</script>

<div class="flex gap-4 flex-col place-items-center">
	{#if header}
		<slot name="header">
			<div class="flex gap-4 items-center">
				<p class="text-color-black">{header.info}</p>
				<p class="font-bold text-transparent bg-clip-text bg-gradient-to-r from-color-purple to-color-blue">{header.amount}</p>
				<p class="text-color-black underline underline-offset-1 text-xs font-semibold">{header.buttonText}</p>
			</div>
		</slot>
	{/if}
	<slot name="buy-input" />
	<div class="flex flex-col place-self-start ml-3 gap-3 mt-4">
		<div class="flex gap-2">
			<p class="text-color-gray-base">Creator gets:</p>
			<p class="text-color-black font-bold">0 {currencySymbol}</p>
		</div>
		<div class="flex gap-2">
			<p class="text-color-gray-base">Royalties:</p>
			<p class="text-color-black font-bold">0 {currencySymbol}</p>
			<button class="ml-1 rounded-full bg-color-gray-lighter px-2"><p>?</p></button>
		</div>
		<div class="flex gap-2">
			<p class="text-color-gray-base">Platform fee:</p>
			<p class="text-color-black font-bold">0 {currencySymbol}</p>
		</div>
	</div>
</div>
