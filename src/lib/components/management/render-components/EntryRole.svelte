<script lang="ts">
	import type { UserRole } from '$interfaces/userData';
	import CheckboxDropdown from '$lib/components/CheckboxDropdown.svelte';
	import { addUserRole } from '$utils/api/addUserRole';
	import { changeCollectionStatus } from '$utils/api/collection';
	import { getRoleColor } from '$utils/api/management/getRoleColor';
	import { notifyError } from '$utils/toast';
	import { noTryAsync } from 'no-try';
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
		if (props.mode === 'USER') {
			let roles: UserRole[] = [];

			event.detail.forEach((e) => {
				if (e.checked) roles.push(e.value);
			});

			const [error, res] = await noTryAsync(() => addUserRole(props.id, roles));

			if (error) {
				notifyError("Failed to update user's roles");
				return;
			}
			console.log(res);
			localProps.role = (res.status === 'INACTIVATED' || 'AWAITING_INACTIVATED' ? 'INACTIVATED' : res.roles?.includes('superadmin') ? 'superadmin' : res.roles?.[0]).toLowerCase();
			localProps.color = getRoleColor(res.status === 'INACTIVATED' || 'AWAITING_INACTIVATED' ? 'INACTIVATED' : res.roles?.includes('superadmin') ? 'superadmin' : res.roles?.[0]);
			localProps = localProps;
		} else if (event.detail?.checked) {
			const [error, res] = await noTryAsync(() => changeCollectionStatus(props.id, event.detail?.value));

			if (error) {
				notifyError("Failed to update collection's status");
				return;
			}

			localProps.color = getRoleColor(res.status);
			localProps.role = res.status?.toLowerCase();
			localProps = localProps;
		}
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
		disableAllOnSelect={localProps.disableAllOnSelect}
		dispatchAllOptions={localProps.dispatchAllOptions}
	/>
</ColumnComponentContainer>
