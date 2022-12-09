<script lang="ts">
	import { outsideClickCallback } from '$actions/outsideClickCallback';
	import ArrowDown from '$icons/arrow-down.svelte';
	import { slide } from 'svelte/transition';

	let showSort = false;
	export let sortOptions: { title: string; action?: any }[] = [];
</script>

<div class="flex-grow relative {$$props.class}">
	<button on:click={() => (showSort = true)} class="w-full h-full border-gradient flex flex-row items-center justify-between px-3.5  hover:bg-main-gradient">
		<h2 class="text-base leading-7 capitalize text-opacity-70 whitespace-nowrap">Sort By</h2>
		<ArrowDown class="w-3.5 h-2.5 transform duration-500 {showSort ? '-rotate-180' : 'rotate-0'}" />
	</button>
	{#if showSort}
		<div
			transition:slide={{ duration: 300 }}
			use:outsideClickCallback={{
				cb: () => (showSort = false),
			}}
			class="relative z-10 mt-1 bg-dark-gradient w-full flex flex-col font-medium text-xs 2xl:text-sm leading-4 2xl:leading-5 whitespace-nowrap truncate sort-list"
		>
			{#each sortOptions as sortOption}
				<button on:click={sortOption.action} class="inline-flex w-full p-2.5 border-2 border-b-0 sort-border border-solid hover:bg-main-gradient">
					{sortOption.title}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style lang="postcss">
	.sort-list button:last-child {
		@apply border-b-2;
	}
	.sort-border {
		border-image: linear-gradient(45deg, rgba(134, 139, 247, 0.25), rgba(108, 199, 248, 0.25)) 1;
	}
</style>
