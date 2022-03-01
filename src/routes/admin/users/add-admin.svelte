<script lang="ts">
	import { AdminPermissionKey, adminPermissions } from '$constants/admin';
	import ChevronLeft from '$icons/chevron-left.svelte';
	import Button from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import Separator from '$lib/components/Separator.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { postCreateAdmin } from '$utils/api/admin/adminManagement';
	import { httpErrorHandler, notifySuccess } from '$utils/toast';

	const adminTypeOptions = [{ label: 'Admin', value: 'admin' }];

	let address: string;
	const roles = {} as Record<AdminPermissionKey, boolean>;

	let isCreatingAdmin = false;

	async function handleCreateAdmin() {
		isCreatingAdmin = true;

		const permissions = Object.entries(roles)
			.map(([k, v]) => (v ? k : null))
			.filter((v) => v);

		await postCreateAdmin(address, permissions)
			.then(() => notifySuccess('Admin created!'))
			.catch(httpErrorHandler);

		isCreatingAdmin = false;
	}
</script>

<div class="flex flex-col w-full h-full min-h-screen overflow-x-hidden md:flex-row">
	<div class="w-2/3 px-20 py-16 overflow-x-auto">
		<div class="text-4xl font-bold uppercase">User management</div>

		<a class="flex items-center gap-4 mt-12 text-lg" href="/admin/users">
			<ChevronLeft />
			<div class="pb-px">BACK</div>
		</a>

		<div class="text-lg italic font-light uppercase mt-14">Add Administrator</div>

		<Separator class="mt-5 mb-10" />

		<div class="flex flex-col">
			<div class="mb-2 text-xs italic font-light uppercase">Address</div>
			<TextInput grayOutline placeholder="0x..." class="w-96 h-14" />

			<div class="mb-2 text-xs italic font-light uppercase old mt-9">Admin Type</div>
			<Dropdown options={adminTypeOptions} class="w-96 h-14" />

			<div class="text-xs italic font-light uppercase mt-9">permissions</div>
			<div class="grid grid-cols-2 grid-rows-3 gap-4 mt-8">
				{#each adminPermissions as permission}
					<Checkbox label={permission.label} bind:checked={roles[permission.key]} />
				{/each}
			</div>

			<Button
				variant="rounded-black"
				class="mt-16 "
				stretch
				on:click={handleCreateAdmin}
				disabled={isCreatingAdmin}
			>
				Save Changes
			</Button>
		</div>
	</div>
</div>
