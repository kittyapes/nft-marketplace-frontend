<script>
	import CloseButtonIcon from '$icons/close-button.svelte';
	import { createEventDispatcher } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import EthAddress from '$lib/components/EthAddress.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { permissions } from '$constants/admin';

	const dispatch = createEventDispatcher();

	const handleClose = () => {
		dispatch('close');
	};
</script>

<div class="z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center p-8 lg:p-0">
	<!-- Dark overlay -->
	<div class="fixed w-full h-full bg-gray-900 opacity-50" />

	<!-- Modal -->
	<div class="bg-white w-full max-w-2xl  mx-auto rounded-xl shadow-xl z-50 relative">
		<div class="px-12 py-6">
			<div class="w-full text-center text-5xl text-color-black uppercase">
				Modify
				<span
					class="text-transparent bg-clip-text bg-gradient-to-r from-color-purple to-color-blue"
				>
					Admin
				</span>
			</div>

			<div class="mt-16 text-color-black grid grid-cols-3 gap-y-6">
				<div class=" font-bold uppercase">Edit Username</div>
				<TextInput grayOutline placeholder="" class="col-span-2" />

				<div class="font-bold uppercase">Address</div>
				<EthAddress
					class="col-span-2"
					address="0x3468C6dE9662C2877vd10184B4228e5711b89D42"
					concat
				/>

				<div class="font-bold uppercase">Admin Type</div>
				<div class="col-span-2">
					<select class="w-full border p-2 rounded-lg">
						<option>Admin</option>
						<option>Super Admin</option>
					</select>
				</div>

				<div class="font-bold uppercase">Permissions</div>
				<div class="max-w-sm grid grid-cols-2 grid-rows-3 gap-4 col-span-2">
					{#each permissions as permission}
						<Checkbox label={permission} />
					{/each}
				</div>
			</div>

			<div class="flex mt-8 justify-center px-16">
				<Button variant="rounded-black" class="h-10 !py-2 " stretch>Save Changes</Button>
			</div>
		</div>

		<div class="absolute top-0 right-0 mt-4 mr-5">
			<button on:click={handleClose}><CloseButtonIcon /></button>
		</div>
	</div>
</div>
