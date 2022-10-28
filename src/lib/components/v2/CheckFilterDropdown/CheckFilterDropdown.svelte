<script lang="ts">
	import ThemedCross from '$icons/themed-cross.svelte';
	import { createEventDispatcher } from 'svelte';
	import EmptyCheckIcon from './EmptyCheckIcon.svelte';
	import FilledCheckIcon from './FilledCheckIcon.svelte';
	import FilterIcon from './FilterIcon.svelte';

	const dispatch = createEventDispatcher();

	export let options: { label: string; checked: boolean }[] = [];
	export let opened: boolean = false;
	export let disabled = false;

	function toggleDropdown() {
		opened = !opened;
	}

	function toggleOption(option: { checked: boolean }) {
		option.checked = !option.checked;
		options = options;

		dispatch('update');
	}

	export function selectAll() {
		options = options.map((o) => ({ ...o, checked: true }));

		dispatch('update');
	}

	export function clearAll() {
		options = options.map((o) => ({ ...o, checked: false }));

		dispatch('update');
	}
</script>

<div class="relative w-40">
	<button
		class="group relative text-left w-full text-color-black border-2 border-color-gray-lighter rounded-lg pl-4 pr-2 outline-none inline-flex items-center gap-2 transition clickable focus-visible:bg-gray-50"
		{disabled}
		class:opacity-50={disabled}
		on:click={toggleDropdown}
	>
		<div class="font-semibold min-w-max">Filter</div>
		<div class="flex-grow" />
		<div class="h-12 border-l-2 border-color-gray-lighter max-h-max transition-colors" />
		<div class="min-w-[2rem] grid place-items-center btn">
			{#if !opened}
				<FilterIcon />
			{:else}
				<ThemedCross />
			{/if}
		</div>
	</button>

	{#if opened}
		<div id="list-container" class="absolute left-0 z-10 w-full overflow-hidden translate-y-full bg-white rounded-lg -bottom-1">
			{#each options as option}
				<button
					class="flex items-center w-full px-4 py-2 font-semibold text-left hover:bg-gray-100 transition-btn active:rounded gap-x-3 outline-none focus-visible:bg-gray-100"
					on:click|stopPropagation={() => toggleOption(option)}
				>
					<div class="w-4">
						{#if option.checked}
							<FilledCheckIcon />
						{:else}
							<EmptyCheckIcon />
						{/if}
					</div>

					{option.label}
				</button>
			{/each}

			<div class="flex justify-center px-2 mb-2 font-bold gap-x-2">
				<button class="btn text-gradient small-button" on:click={selectAll}>Select all</button>
				<div class="text-lg text-gradient">&middot;</div>
				<button class="btn text-gradient small-button" on:click={clearAll}>Clear all</button>
			</div>
		</div>
	{/if}
</div>

<style>
	#list-container {
		box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.12);
	}

	.small-button {
		@apply text-sm outline-none focus-visible:border rounded px-1 border-color-purple;
	}
</style>
