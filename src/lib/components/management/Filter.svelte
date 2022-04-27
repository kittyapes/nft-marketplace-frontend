<script lang="ts">
	import IconDropdown from '../IconDropdown.svelte';

	export let options;
	export let icon;
	export let entries;
	export let defaultOption = options?.[0];

	let defaultEntries = entries;
	let lastEvent;

	$: if (entries && lastEvent) {
		handleFilter(lastEvent);
	}

	let handleFilter = (event: CustomEvent) => {
		lastEvent = event;
		entries = defaultEntries.filter((e) => {
			if (!event.detail.cb) return false;
			return event.detail.cb(e);
		});
	};

	let handleClear = () => {
		entries = defaultEntries;
	};
</script>

<div class="w-44">
	<IconDropdown on:select={handleFilter} on:clear={handleClear} {options} selected={defaultOption}>
		<svelte:component this={icon} slot="icon" />
	</IconDropdown>
</div>
