<script>
	import CloseButton from '$icons/close-button.svelte';
	import { createEventDispatcher } from 'svelte';
	import Button from '../Button.svelte';
	import Checkbox from '../Checkbox.svelte';

	const dispatch = createEventDispatcher();

	const handleClose = () => {
		console.log('sdkfj');
		dispatch('close');
	};
</script>

<div class="z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center p-8 lg:p-0">
	<!-- Dark overlay -->
	<div class="fixed w-full h-full bg-gray-900 opacity-50" />

	<!-- Modal -->
	<div class="bg-white w-full max-w-lg h-60 mx-auto rounded-xl shadow-xl z-50 relative">
		<div class="px-24 py-6">
			<div class="text-2xl font-bold text-color-black uppercase">Promote user to</div>

			<div class="w-auto mt-6 inline-grid grid-cols-2 grid-rows-2 gap-y-4 gap-x-3">
				<span>Verified Creator</span>
				<Checkbox />

				<span>Super Admin</span>
				<Checkbox />
			</div>

			<div class="flex gap-4 mt-8">
				<Button variant="rounded-gradient" class="!w-32 h-10 !py-2">Okay</Button>
				<Button variant="rounded-outline" class="!w-32 h-10 !py-2" on:click={handleClose}>
					Cancel
				</Button>
			</div>
		</div>

		<div class="absolute top-0 right-0 mt-4 mr-5">
			<button on:click={handleClose}><CloseButton /></button>
		</div>
	</div>
</div>
