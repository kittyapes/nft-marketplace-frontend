<script lang="ts">
	import CheckboxDropdown from '$lib/components/CheckboxDropdown.svelte';
	import ColumnComponentContainer from '../ColumnComponentContainer.svelte';

	export let props;
	export let entries;
	let defaultEntries = entries;

	let handleFilter = (event: CustomEvent) => {
		entries = defaultEntries.filter((e) => {
			if (!event.detail.cb) return false;
			return event.detail.cb(e);
		});
	};

	let handleClear = () => {
		entries = defaultEntries;
	};
</script>

<ColumnComponentContainer>
	<CheckboxDropdown on:select={handleFilter} on:clear={handleClear} options={props} />
</ColumnComponentContainer>
