<script lang="ts">
	export let options: { label: string; value?: string }[];
	export let btnClass = '';

	$: if (options.length < 1) {
		throw new Error('No options provided');
	}

	export let selected: { label: string; value?: string } = options[0];
	export let opened: boolean = false;

	let elemOpenButton: HTMLButtonElement;

	$: if (opened) {
		document.addEventListener('click', (event) => {
			if (event.target !== elemOpenButton) {
				opened = false;
			}
		});
	}
</script>

<div class="relative select-container select-none {$$props.class}">
	<button
		class="select text-left {btnClass}"
		on:click={() => (opened = !opened)}
		bind:this={elemOpenButton}
	>
		{selected.label}
	</button>

	{#if opened}
		<div
			id="list-container"
			class="absolute bottom-0 translate-y-full bg-white rounded-lg overflow-hidden z-10 w-full"
		>
			{#each options as option}
				<button
					class="font-semibold text-left py-2 px-4 hover:bg-gray-100 w-full transition-btn active:rounded"
					on:click={() => (selected = option)}
				>
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
