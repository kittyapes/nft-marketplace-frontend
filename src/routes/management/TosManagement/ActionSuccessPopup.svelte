<script lang="ts">
	import Popup from '$lib/components/Popup.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import type { PopupHandler } from '$utils/popup';

	export let handler: PopupHandler;
</script>

<Popup>
	<div class="py-8 px-12 max-w-3xl text-white">
		<div class="text-2xl font-semibold">
			<slot name="title" />
		</div>

		<div class="mt-4">
			<slot name="content" />
		</div>

		<div class="mt-16">
			<PrimaryButton on:click={handler.close}>Continue</PrimaryButton>
		</div>
	</div>
</Popup>
