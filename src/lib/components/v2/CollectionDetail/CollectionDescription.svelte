<script lang="ts">
	import type { Collection } from '$utils/api/collection';

	export let collectionData: Collection;
	import Button from '$lib/components/Button.svelte';
	export let actionLabel: string;
</script>

<div class="flex items-center justify-between mt-11">
	<p class="w-1/2 font-semibold text-sm leading-6">{collectionData?.description || ''}</p>
	<div class="w-1/2 flex items-center justify-end gap-x-4">
		<Button on:click variant="square" dullgradient class="w-[139px] 2xl:w-44  h-11 2xl:h-14 border-gradient hover:bg-main-gradient">{actionLabel}</Button>
		<!-- TODO this opens up all social links -->
		<button class="w-11 h-11 2xl:w-14 2xl:h-14 border-gradient dull-gradient flex items-center justify-center transition-btn hover:bg-main-gradient">
			<!-- TODO add share icon -->
		</button>
	</div>
</div>
