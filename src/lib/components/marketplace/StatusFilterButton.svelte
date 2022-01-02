<script>
	import { statusFilters } from '$stores/marketplace';

	export let value;
	let selected = $statusFilters.has(value);

	let updateSelected = () => {
		if (!selected) {
			selected = true;
			statusFilters.update((val) => val.add(value));
		} else {
			selected = false;
			statusFilters.update((val) => {
				val.delete(value);
				return val;
			});
		}
	};
</script>

<button
	class="w-28 py-3 border-2 rounded-lg border-opacity-50 border-black bg-opacity-20 font-bold"
	class:border-color-blue={selected}
	class:bg-color-blue={selected}
	on:click={updateSelected}
>
	{value}
</button>
