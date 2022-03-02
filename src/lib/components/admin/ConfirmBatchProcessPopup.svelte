<script>
	import { forceBatchProcess } from '$utils/api/admin/batchProcessing';

	import { closePopup } from '$utils/popup';
	import { httpErrorHandler, makeErrorHandler, makeSuccessHandler } from '$utils/toast';

	import Popup from '../Popup.svelte';

	let isProcessing = false;

	async function processNow() {
		isProcessing = true;

		await forceBatchProcess()
			.then(makeSuccessHandler('Batch processing completed.'))
			.catch(httpErrorHandler);

		isProcessing = false;

		closePopup();
	}
</script>

<Popup class="py-8 px-16">
	<div class="text-xl uppercase font-semibold text-center">
		Immediate <span class="gradient-text">batch process</span>
		required
	</div>

	<div class="max-w-prose mt-4 text-center">
		Your action has been added to the batch process queue. It will not be processed until a batch
		process is executed. You can either execute the batch process now or wait for it to be executed
		on schedule.
	</div>

	<div class="flex mt-8 justify-center gap-x-4">
		<button class="btn btn-secondary w-44" on:click={closePopup} disabled={isProcessing}>
			Wait
		</button>
		<button class="btn-primary w-44" on:click={processNow} disabled={isProcessing}>
			Process now
		</button>
	</div>
</Popup>
