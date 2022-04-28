<script lang="ts">
	import type { UserData } from 'src/interfaces/userData';
	import IconDropdown from '../IconDropdown.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let options: any;
	export let icon: any;
	export let entries: UserData[];
	export let defaultOption = options?.[0];

	let defaultEntries = entries;
	let lastEvent;

	let handleFilter = (event: CustomEvent) => {
		console.log(defaultEntries);
		lastEvent = event;
		dispatch('filter', {
			changeTo: defaultEntries.filter((e) => {
				if (!event.detail.cb) return false;
				return event.detail.cb(e);
			})
		});
	};

	$: if (entries && lastEvent) {
		handleFilter(lastEvent);
		console.log(entries);
	}
</script>

<div class="w-44">
	<IconDropdown on:select={handleFilter} {options} selected={defaultOption}>
		<svelte:component this={icon} slot="icon" />
	</IconDropdown>
</div>
