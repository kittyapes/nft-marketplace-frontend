<script lang="ts">
	import { forceBatchProcess } from '$utils/api/admin/batchProcessing';
	import { closePopup, type PopupHandler } from '$utils/popup';
	import { httpErrorHandler, makeSuccessHandler } from '$utils/toast';

	import Popup from '../Popup.svelte';
	import PrimaryButton from '../v2/PrimaryButton/PrimaryButton.svelte';

	export let handler: PopupHandler;

	let isProcessing = false;

	async function processNow() {
		isProcessing = true;

		await forceBatchProcess().then(makeSuccessHandler('Batch processing completed.')).catch(httpErrorHandler);

		isProcessing = false;

		closePopup();
	}
</script>

<Popup class="py-8 px-16 text-white">
	<div class="text-xl uppercase font-semibold text-center pt-2">
		Immediate <span class="text-gradient">batch process</span>
		required
	</div>

	<div class="max-w-prose mt-4 text-center p-2 px-10">
		Your action has been added to the batch process queue. It will not be processed until a batch process is executed. You can either execute the batch process now or wait for it to be executed on
		schedule.
	</div>

	<div class="flex py-4 justify-center gap-x-4">
		<PrimaryButton extButtonClass="w-44" on:click={handler.close} disabled={isProcessing}>Wait</PrimaryButton>
		<PrimaryButton extButtonClass="w-44" variant="green" on:click={processNow} disabled={isProcessing}>Process now</PrimaryButton>
	</div>
</Popup>
