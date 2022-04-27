<script lang="ts">
	import CheckboxDropdown from '$lib/components/CheckboxDropdown.svelte';
	import ColumnComponentContainer from '../ColumnComponentContainer.svelte';

	export let props;

	let localProps;

	$: if (props) {
		localProps = props;
		if (props.role === 'superadmin') localProps.role = 'sadmin';
	}

	let handleSelect = (event: CustomEvent) => {};
</script>

<ColumnComponentContainer>
	<CheckboxDropdown class="pl-0 {localProps.color || ''} z-[4]" on:change={handleSelect} options={localProps.options} dropdownLabel={localProps.role} />
</ColumnComponentContainer>
