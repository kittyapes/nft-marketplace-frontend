<script lang="ts">
	import type { UserRole } from '$interfaces/userData';
	import CheckboxDropdown from '$lib/components/CheckboxDropdown.svelte';
	import { addUserRole } from '$utils/api/addUserRole';
	import { changeCollectionStatus } from '$utils/api/collection';
	import { getGradientColors } from '$utils/api/management/getGradientColors';
	import { getHighestRole } from '$utils/api/management/getHighestRole';
	import { getRoleColor } from '$utils/api/management/getRoleColor';
	import { userHasRole } from '$utils/auth/userRoles';
	import { notifyError } from '$utils/toast';
	import { noTryAsync } from 'no-try';
	import ColumnComponentContainer from '../ColumnComponentContainer.svelte';

	export let props;

	let localProps;
	let changingRoles = false;

	$: allRoles = props.options.map((opt) => opt.value);

	function convertRoleToLabel(role: String) {
		let res = role;

		if (role === 'superadmin') res = 'sadmin';
		else if (role === 'inactivated_user' || props.role === 'inactivated') res = 'inactive';
		else if (role === 'verified_user') res = 'verified';
		else if (role === 'ACTIVE') res = 'Listed';
		else if (role === 'INACTIVE') res = 'Inactive';

		return res;
	}

	function propsToLocalProps(props) {
		// deep copy
		localProps = JSON.parse(JSON.stringify(props));
		localProps.role = localProps.role?.toLowerCase();

		// remove the ability to edit the admin role if current user isn't superadmin
		if (!$userHasRole('superadmin')) {
			localProps.options = props.options.slice(1);
		}

		// change label of displayed role
		localProps.role = convertRoleToLabel(props.role);
	}

	$: if (props) {
		propsToLocalProps(props);
	}

	$: {
		localProps.options.forEach((o) => {
			o.disabled = changingRoles;
		});

		localProps = localProps;
	}

	let handleSelect = async (event: CustomEvent) => {
		if (props.mode === 'USER') {
			changingRoles = true;

			let roles: UserRole[] = [];

			props.options.forEach((o) => {
				if (o.checked) roles.push(o.value);
			});

			localProps.options.forEach((o) => {
				if (o.checked && !roles.includes(o.value)) roles.push(o.value);
				else if (!o.checked && roles.includes(o.value)) roles.splice(roles.indexOf(o.value), 1);
			});

			const [error, res] = await noTryAsync(() => addUserRole(props.id, roles, event.detail.value));

			if (error) {
				notifyError("Failed to update user's roles");
				return;
			}

			let highestRole = getHighestRole([...roles, ...res.roles]);
			localProps.role = convertRoleToLabel(highestRole);
			localProps.color = getRoleColor(highestRole);
			localProps.arrowGradient = getGradientColors(highestRole);

			// update checked boxes
			res.roles.forEach((role) =>
				localProps.options.forEach((option) => {
					if (option.value === role && !option.checked) {
						option.checked = true;
					}
				}),
			);

			allRoles.forEach((role) => {
				if (!res.roles.includes(role)) {
					localProps.options.find((opt) => opt.value === role).checked = false;
				}
			});

			localProps = localProps;

			changingRoles = false;
		} else if (event.detail?.checked) {
			changingRoles = true;

			const [error, res] = await noTryAsync(() => changeCollectionStatus(props.id, event.detail?.value));

			if (error) {
				notifyError("Failed to update collection's status");
				return;
			}

			localProps.color = getRoleColor(res.status);
			localProps.role = res.status?.toLowerCase();
			localProps.arrowGradient = getGradientColors(localProps.role);
			localProps = localProps;

			changingRoles = false;
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
		uncheckAllOnSelect={localProps.uncheckAllOnSelect}
		dispatchAllOptions={localProps.dispatchAllOptions}
		disabled={props.role === 'superadmin'}
		disabledOpacity={false}
	/>
</ColumnComponentContainer>
