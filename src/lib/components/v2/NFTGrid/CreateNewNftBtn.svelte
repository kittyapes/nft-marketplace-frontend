<script lang="ts">
	import { goto } from '$app/navigation';
	import AddCircle from '$icons/add-circle.svelte';
	import { nftDraft } from '$stores/create';

	export let collectionId: string;
</script>

<div
	class="grid place-items-center border border-dashed clickable hover:scale-105  transition-all"
	on:click={() => {
		$nftDraft = {};
		$nftDraft.collectionId = collectionId;
		goto('/create');
	}}
>
	<div class="flex flex-col items-center justify-center gap-4">
		<button class="rounded-full btn mt-4">
			<AddCircle />
		</button>
		<div class="mb-4">Create a new NFT</div>
	</div>
</div>
