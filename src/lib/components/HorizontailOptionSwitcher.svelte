<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let options: { label: string }[];
	export let defaultOptionIndex: number = 0;
	export let selected: { label: string } = options[defaultOptionIndex];

	const dispatch = createEventDispatcher();

	const selectItem = (option: { label: string }) => {
		// selected = option;
		dispatch('StakeDurationUpdated', option);
	};
</script>

<div class="flex bg-white rounded-xl border-2">
	{#each options as option}
		<div class="border-r-2 last:border-0 h-full flex-grow w-20">
			<button
				on:click={() => selectItem(option)}
				class="w-full transition-colors p-3"
				class:text-color-blue={option === selected}
			>
				{option.label}
			</button>
		</div>
	{/each}
</div>
