<script>
	import { statusFilters } from '../../../../stores/marketplace';
	export let id;
	let selected = false;

	let updateSelected = () => {
		if (!selected) {
			$statusFilters[id].selected = true;
			selected = true;
		} else {
			$statusFilters[id].selected = false;
			selected = false;
		}
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
