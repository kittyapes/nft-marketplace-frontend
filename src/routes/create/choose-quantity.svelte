<script>
	import { goto } from '$app/navigation';
	import { newDropProperties } from '$stores/create';
	import CardButton from '$lib/components/create/CardButton.svelte';
	import Quantity from '$lib/components/create/Quantity.svelte';
	import StepTitle from '$lib/components/create/StepTitle.svelte';

	function handleSingle() {
		newDropProperties.update((v) => ({ ...v, quantity: 'single' }));
		goto('/create/create-drop');
	}

	function handleMultiple() {
		newDropProperties.update((v) => ({ ...v, quantity: 'multiple' }));
		goto('/create/create-drop');
	}
</script>

<hr class="separator" />

<StepTitle blackText="Step 1: Choose your quantity" />

<p class="font-poppins text-[#585858] mt-8">
	Choose “Single” for one of a kind or “Multiple” if you want to sell one collectible multiple times
</p>

<div class="grid grid-cols-2 mt-6 mb-64 gap-8">
	<CardButton on:click={handleSingle}>
		<Quantity
			imageUrl="/img/create/quantity-single.svg"
			title="Single"
			description="If you want to highlight the uniqueness and individuality of your item"
		/>
	</CardButton>

	<CardButton on:click={handleMultiple}>
		<Quantity
			imageUrl="/img/create/quantity-multiple.svg"
			title="Multiple"
			description="If you want to highlight the uniqueness and individuality of your item"
		/>
	</CardButton>
</div>
