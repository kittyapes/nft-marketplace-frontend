<script lang="ts">
	import type { UserRole } from '$interfaces/userData';
	import CheckboxDropdown from '$lib/components/CheckboxDropdown.svelte';
	import { addUserRole } from '$utils/api/addUserRole';
	import { changeCollectionStatus } from '$utils/api/collection';
	import { getGradientColors } from '$utils/api/management/getGradientColors';
	import { getHighestRole } from '$utils/api/management/getHighestRole';
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

			localProps.options.forEach((o) => {
				if (o.checked) roles.push(o.value);
			});

			const [error, res] = await noTryAsync(() => addUserRole(props.id, roles, event.detail.value));

			if (error) {
				notifyError("Failed to update user's roles");
				return;
			}

			localProps.role = getHighestRole([...roles, ...res.roles]);
			localProps.color = getRoleColor(localProps.role);
			localProps.arrowGradient = getGradientColors(localProps.role);
			localProps = localProps;
		} else if (event.detail?.checked) {
			const [error, res] = await noTryAsync(() => changeCollectionStatus(props.id, event.detail?.value));

			if (error) {
				notifyError("Failed to update collection's status");
				return;
			}

			localProps.color = getRoleColor(res.status);
			localProps.role = res.status?.toLowerCase();
			localProps.arrowGradient = getGradientColors(localProps.role);
			localProps = localProps;
		}
	};
</script>

<ColumnComponentContainer>
	<CheckboxDropdown
		class="pl-0 {localProps.color || ''} z-[9] font-medium"
		id={localProps.id}
		on:change={handleSelect}
		options={localProps.options}
		arrowGradient={localProps.arrowGradient}
		dropdownLabel={localProps.role}
		disableAllOnSelect={localProps.disableAllOnSelect}
		dispatchAllOptions={localProps.dispatchAllOptions}
	/>
</ColumnComponentContainer>
