<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';

	import Modal from '$lib/components/Modal.svelte';
	import Popup from '$lib/components/Popup.svelte';

	export let variant: 'inactivate' | 'promote' | '' = '';

	const dispatch = createEventDispatcher();

	const onClose = () => {
		dispatch('close');
	};
</script>

<Modal>
	<Popup closeButton class="w-full max-w-lg h-60 flex flex-col items-center" on:close={onClose}>
		{#if variant === 'inactivate'}
			<div class="title">inactivate Verified Status</div>
			<div class="w-full mt-10 text-center text-color-black px-6">
				Are you sure you want to inactivate the verified creator permissions on this account?
			</div>

			<div class="flex gap-4 mt-8 justify-center">
				<Button class="!w-32 h-10 !py-2" gradient rounded>Okay</Button>
				<Button variant="rounded-outline" class="!w-32 h-10 !py-2" on:click={onClose}>
					Cancel
				</Button>
			</div>
		{/if}

		{#if variant === 'promote'}
			<div class="title">Promote User</div>
			<div class="w-auto mt-6 inline-grid grid-cols-2 grid-rows-2 gap-y-4 gap-x-3">
				<span>Verified Creator</span>
				<Checkbox />

				<span>Super Admin</span>
				<Checkbox />
			</div>

			<div class="flex gap-4 mt-8">
				<Button class="!w-32 h-10 !py-2" gradient rounded>Okay</Button>
				<Button variant="rounded-outline" class="!w-32 h-10 !py-2" on:click={onClose}>
					Cancel
				</Button>
			</div>
		{/if}
	</Popup>
</Modal>

<style>
	.title {
		@apply uppercase font-bold text-2xl text-center;
	}
</style>
