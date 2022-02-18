<script>
	export let mode = 'v1';
</script>

<div class="flex w-64 h-10 rounded-full overflow-hidden font-semibold">
	<button class="rounded-l-full" on:click={() => (mode = 'v1')} class:selected={mode === 'v1'}
		>V1</button
	>
	<button
		class="rounded-r-full"
		on:click={() => (mode = 'hinata')}
		class:selected={mode === 'hinata'}
	>
		HINATA
	</button>
</div>

<style>
	button {
		@apply grid place-items-center w-1/2 transition duration-200;
	}

	button:not(.selected) {
		@apply border border-[#969696] text-[#969696];
	}

	.flex {
		filter: drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.1));
	}

	.selected {
		@apply bg-color-black text-white;
	}
</style>
