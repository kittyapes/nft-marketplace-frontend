<script>
	import CloseButtonIcon from '$icons/close-button.svelte';
	import { createEventDispatcher } from 'svelte';
	import Button from '../Button.svelte';
	import Checkbox from '../Checkbox.svelte';

	const dispatch = createEventDispatcher();

	const handleClose = () => {
		dispatch('close');
	};
</script>

<div class="z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center p-8 lg:p-0">
	<!-- Dark overlay -->
	<div class="fixed w-full h-full bg-gray-900 opacity-50" />

	<!-- Modal -->
	<div class="bg-white w-full max-w-lg h-60 mx-auto rounded-xl shadow-xl z-50 relative">
		<div class="px-6 py-6">
			<div class="w-full text-center text-2xl font-bold text-color-black uppercase">
				Inactivate VERIFIED STATUS
			</div>

			<div class="w-full mt-10 text-center text-color-black">
				Are you sure you want to inactivate the verified creator permissions on this account?
			</div>

			<div class="flex gap-4 mt-8 justify-center">
				<Button variant="rounded-gradient" class="!w-32 h-10 !py-2">Okay</Button>
				<Button variant="rounded-outline" class="!w-32 h-10 !py-2" on:click={handleClose}>
					Cancel
				</Button>
			</div>
		</div>

		<div class="absolute top-0 right-0 mt-4 mr-5">
			<button on:click={handleClose}><CloseButtonIcon /></button>
		</div>
	</div>
</div>
