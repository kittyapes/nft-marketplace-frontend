<script>
	let selected = false;

	let updateSelected = () => {
		selected = !selected;
	};
</script>

<button
	class="w-28 py-3 border-2 rounded-lg border-opacity-50 border-black bg-opacity-20 font-bold"
	class:border-color-blue={selected}
	class:bg-color-blue={selected}
	on:click={updateSelected}
>
	<slot />
</button>
