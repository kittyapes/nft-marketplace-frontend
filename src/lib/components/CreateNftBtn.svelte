<script lang="ts">
	import { goto } from '$app/navigation';
	import AddCircle from '$icons/add-circle.svelte';
	import { nftDraft } from '$stores/create';

	export let collectionId: string;
</script>

<div
	class="grid place-items-center border border-dashed border-opacity-30 border-color-gray-base clickable hover:scale-105 transition-all rounded-2xl max-w-[246px] min-h-[315px]"
	on:click={() => {
		$nftDraft = {};
		$nftDraft.collectionId = collectionId;
		goto('/create');
	}}
>
	<div class="flex flex-col items-center justify-center gap-4">
		<button class="rounded-full btn">
			<AddCircle />
		</button>
		<div class="text-color-gray-dark">Create a new NFT</div>
	</div>
</div>
