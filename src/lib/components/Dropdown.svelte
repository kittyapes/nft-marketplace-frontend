<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	interface Option {
		value?: string;
		label: string;
		iconUrl?: string;
	}

	export let options: Option[];
	export let btnClass = '';

	$: if (!options?.length) {
		throw new Error('No options provided');
	}

	export let selected: Option = options?.[0];
	export let opened: boolean = false;
	export let disabled = false;

	let elemOpenButton: HTMLButtonElement;

	$: if (opened) {
		document.addEventListener('click', (event) => {
			if (event.target !== elemOpenButton) {
				opened = false;
			}
		});
	}

	function handleOptionSelect(option) {
		selected = option;
		dispatch('select', option);
	}
</script>

<div class="relative select-container select-none transition {$$props.class}" class:opacity-50={disabled}>
	<button class="text-left select flex items-center space-x-2" on:click={() => (opened = !opened)} bind:this={elemOpenButton} {disabled}>
		<!-- Icon -->
		{#if selected.iconUrl}
			<img src={selected.iconUrl} alt="" class="w-6" />
		{/if}

		<!-- Label -->
		<div>
			{selected?.label}
		</div>
	</button>

	{#if opened}
		<div id="list-container" class="absolute bottom-0 z-10 w-full overflow-hidden translate-y-full bg-white rounded-lg overflow-y-scroll max-h-32 custom-scrollbar">
			{#each options as option}
				<button class="w-full px-4 py-2 font-semibold text-left hover:bg-gray-100 transition-btn active:rounded flex items-center gap-x-2" on:click={() => handleOptionSelect(option)}>
					{#if option.iconUrl}
						<img src={option.iconUrl} alt="" class="w-6" />
					{/if}
					{option.label}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	#list-container {
		box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.12);
	}
</style>
