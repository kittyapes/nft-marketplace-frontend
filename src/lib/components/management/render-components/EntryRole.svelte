<script lang="ts">
	import type { UserRole } from '$interfaces/userData';

	import CheckboxDropdown from '$lib/components/CheckboxDropdown.svelte';
	import { addUserRole } from '$utils/api/addUserRole';
	import ColumnComponentContainer from '../ColumnComponentContainer.svelte';

	export let props;

	let localProps;

	$: if (props) {
		localProps = props;
		localProps.role = localProps.role?.toLowerCase();
		if (props.role === 'superadmin') localProps.role = 'sadmin';
		else if (props.role === 'inactivated_user' || props.role === 'inactivated') localProps.role = 'inactive';
		else if (props.role === 'verified_user') localProps.role = 'verified';
	}

	let handleSelect = async (event: CustomEvent) => {
		let roles: UserRole[] = [];
		if (event.detail?.checked) roles.push(event.detail?.value);
		const res = await addUserRole(props.id, roles);
	};
</script>

<ColumnComponentContainer>
	<CheckboxDropdown
		class="pl-0 {localProps.color || ''} z-[9] font-semibold"
		id={localProps.id}
		on:change={handleSelect}
		options={localProps.options}
		dropdownLabel={localProps.role}
		gradient={localProps.role === 'admin'}
	/>
</ColumnComponentContainer>
