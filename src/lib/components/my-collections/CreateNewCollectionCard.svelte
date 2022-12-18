<script lang="ts">
	import { goto } from '$app/navigation';

	import AddCircle from '$icons/add-circle.svelte';
</script>

<div class="grid place-items-center border border-dashed  border-white rounded-2xl w-[17rem] h-60 clickable hover:scale-105 transition-all" on:click={() => goto('/collections/new/edit')}>
	<div class="flex flex-col gap-4 items-center justify-center">
		<button class="rounded-full btn">
			<AddCircle />
		</button>
		<div class="">Create new collection</div>
	</div>
</div>
