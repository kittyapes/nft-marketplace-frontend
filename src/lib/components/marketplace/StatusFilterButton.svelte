<script>
	import { filters } from '$stores/marketplace';

	export let value;
	let selected = $filters.status.has(value);

	let updateSelected = () => {
		if (!selected) {
			selected = true;
			$filters.status.add(value);
			filters.update((val) => val);
		} else {
			selected = false;
			$filters.status.delete(value);
			filters.update((val) => val);
		}
	};
</script>

<button class="w-28 py-3 border-2 rounded-lg border-opacity-50 border-black bg-opacity-20 font-bold" class:border-color-blue={selected} class:bg-color-blue={selected} on:click={updateSelected}>
	{value}
</button>
