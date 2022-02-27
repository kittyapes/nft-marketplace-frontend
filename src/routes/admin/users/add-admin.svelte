<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Separator from '$lib/components/Separator.svelte';
	import { adminPermissions, AdminPermissionKey } from '$constants/admin';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import ChevronLeft from '$icons/chevron-left.svelte';
	import { createAdmin } from '$utils/api/admin/userManagement';
	import { notifyError, notifySuccess } from '$utils/toast';

	const adminTypeOptions = [{ label: 'Super Admin' }];

	let name: string;
	let address: string;
	const roles = {} as Record<AdminPermissionKey, boolean>;

	let isCreatingAdmin = false;

	async function handleCreateAdmin() {
		isCreatingAdmin = true;

		const permissions = Object.entries(roles)
			.map(([k, v]) => (v ? k : null))
			.filter((v) => v);

		await createAdmin({ name, address, permissions })
			.catch((e) => {
				notifyError(e.message);
				throw e;
			})
			.then(() => notifySuccess('Admin created!'));

		isCreatingAdmin = false;
	}
</script>

<div class="w-full min-h-screen h-full flex flex-col md:flex-row overflow-x-hidden">
	<div class="w-2/3 px-20 py-16 overflow-x-auto">
		<div class="text-4xl uppercase font-bold">User management</div>

		<a class="mt-12 flex gap-4 items-center text-lg" href="/admin/users">
			<ChevronLeft />
			<div class="pb-px">BACK</div>
		</a>

		<div class="uppercase text-lg font-light italic mt-14">Add Administrator</div>

		<Separator class="mt-5 mb-10" />

		<div class="flex flex-col">
			<div class="text-xs font-light italic uppercase mb-2">Creator Username</div>
			<TextInput grayOutline placeholder="newadmin" class="w-96 h-14 italic" bind:value={name} />

			<div class="text-xs font-light italic uppercase mt-9 mb-2">Address</div>
			<TextInput grayOutline placeholder="0x..." class="w-96 h-14" />

			<div class="text-xs font-light italic old uppercase mt-9 mb-2">Admin Type</div>
			<Dropdown options={adminTypeOptions} class="w-96 h-14" />

			<div class="text-xs font-light italic uppercase mt-9">permissions</div>
			<div class="grid grid-cols-2 grid-rows-3 gap-4 mt-8">
				{#each adminPermissions as permission}
					<Checkbox label={permission.label} bind:checked={roles[permission.key]} />
				{/each}
			</div>

			<Button
				variant="rounded-black"
				class=" mt-16"
				stretch
				on:click={handleCreateAdmin}
				disabled={isCreatingAdmin}
			>
				Save Changes
			</Button>
		</div>
	</div>
</div>
