<script lang="ts">
	import EthAddress from '$lib/components/EthAddress.svelte';
	import { AdminData, putModifyAdmin } from '$utils/api/admin/adminManagement';
	import { httpErrorHandler, notifySuccess } from '$utils/toast';
	import Dropdown from '../Dropdown.svelte';
	import Popup from '../Popup.svelte';

	const adminTypeOptions = [{ label: 'Admin', value: 'admin' }];

	export let userData: AdminData;

	let name = userData?.name;

	let isSubmiting = false;

	async function submit() {
		isSubmiting = true;

		await putModifyAdmin(userData._id, name, userData.wallet, 'admin')
			.then(() => notifySuccess('Admin created!'))
			.catch(httpErrorHandler);

		isSubmiting = false;
	}
</script>

<Popup class="min-w-[600px]" closeButton>
	<div class="px-12 py-12">
		<div class="w-full text-center text-5xl text-color-black uppercase">
			Modify
			<span class="text-transparent bg-clip-text bg-gradient-to-r from-color-purple to-color-blue">
				Admin
			</span>
		</div>

		<div class="mt-16 text-color-black grid grid-cols-3 gap-y-6">
			<div class=" font-bold uppercase">Edit Username</div>
			<input placeholder="Account name" class="input col-span-2" bind:value={name} />

			<div class="font-bold uppercase">Address</div>
			<EthAddress class="col-span-2" address="0x3468C6dE9662C2877vd10184B4228e5711b89D42" concat />

			<div class="font-bold uppercase">Role</div>
			<div class="col-span-2">
				<Dropdown options={adminTypeOptions} />
			</div>

			<!-- <div class="font-bold uppercase">Permissions</div> -->
			<!-- <div class="max-w-sm grid grid-cols-2 grid-rows-3 gap-4 col-span-2"> -->
			<!-- {#each permissions as permission}
						<Checkbox label={permission} />
					{/each} -->
			<!-- </div> -->
		</div>

		<div class="flex mt-8 justify-center px-16">
			<button class="btn-primary" disabled={isSubmiting} on:click={submit}>Delete</button>
			<button class="btn-primary" disabled={isSubmiting} on:click={submit}>Save Changes</button>
		</div>
	</div>
</Popup>
