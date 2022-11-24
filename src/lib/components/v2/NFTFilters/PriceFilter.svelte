<script lang="ts">
	import Button from '$lib/components/Button.svelte';

	export let minPrice: number;
	export let maxPrice: number;
</script>

<div class="w-full flex flex-col gap-y-4 2xl:gap-y-5 font-medium text-sm 2xl:text-lg leading-6 2xl:leading-7">
	<div class="flex flex-row items-center">
		<input bind:value={minPrice} type="number" placeholder="Min" class="px-4 2xl:px-6 py-2 2xl:py-2.5 outline-none w-16 2xl:w-20 border-gradient bg-gradient-a" />
		<p class="ml-12 2xl:ml-14 mr-9 2xl:mr-12">to</p>
		<input bind:value={maxPrice} type="number" placeholder="Max" class="px-4 2xl:px-6 py-2 2xl:py-2.5 outline-none w-16 2xl:w-20 border-gradient bg-gradient-a" />
	</div>
	<Button stretch class="h-11 2xl:h-14 hover:bg-main-gradient bg-gradient-a border-gradient">Apply</Button>
</div>
