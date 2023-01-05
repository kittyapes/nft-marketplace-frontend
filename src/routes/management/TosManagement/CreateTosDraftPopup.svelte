<script lang="ts">
	import Popup from '$lib/components/Popup.svelte';
	import TextInput from '$lib/components/v2/TextInput/TextInput.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { apiPostNewTosVersion } from '$utils/api/tos';
	import type { PopupHandler } from '$utils/popup';
	import { notifyError, notifySuccess } from '$utils/toast';

	export let handler: PopupHandler;
	export let onSuccess: () => any = null;
	export let newVersionLabel: string;

	let isWorking = false;

	async function handleUpload() {
		isWorking = true;

		const res = await apiPostNewTosVersion(newVersionLabel, pdfUrl, htmlUrl);

		if (res.err) {
			notifyError('Failed to create new TOS version. ' + res.err.message);
		} else {
			notifySuccess('Successfully created new TOS version.');

			onSuccess?.();

			handler.close();
		}

		isWorking = false;
	}

	let pdfUrl: string;
	let htmlUrl: string;

	$: isPdfUrlValid = pdfUrl;
	$: isHtmlUrlValid = htmlUrl;
</script>

<Popup>
	<div class="py-8 px-12 max-w-3xl text-white">
		<div class="text-2xl font-semibold">Upload new Terms of Service documents</div>
		<div class="mt-4">Please provide links to both, the PDF document and the HTML document.</div>
		<div class="mt-3">
			The PDF file retrieved from the URL and hashed. Each user will be required to sign the hash of this document with their private key. This signature will then be saved in case you need it for
			legal purposes.
		</div>
		<div class="mt-3">
			The HTML file will be used for styled ToS rendering on the website. This version will not be hashed and will not be used for signatures. This version cannot be used for legal purposes.
		</div>

		<div class="flex gap-4 mt-6">
			<div class="gap-4 flex flex-col flex-grow">
				<div class="flex items-center gap-4">
					<div class="w-40 whitespace-nowrap flex-shrink-0">URL to PDF file:</div>
					<TextInput placeholder="https://hinata.io/.../tos.pdf" bind:value={pdfUrl} />
				</div>

				<div class="flex items-center gap-4">
					<div class="w-40 whitespace-nowrap flex-shrink-0">URL to HTML file:</div>
					<TextInput placeholder="https://hinata.io/.../tos.html" bind:value={htmlUrl} />
				</div>
			</div>

			<div class="w-48">
				<PrimaryButton on:click={handleUpload} disabled={!isPdfUrlValid || !isHtmlUrlValid || isWorking} extButtonClass="!h-full">
					{#if isWorking}
						<ButtonSpinner />
					{/if}

					Upload
				</PrimaryButton>
			</div>
		</div>

		<div class="flex items-center">
			<div class="font-medium mt-4 flex-grow">
				Version: <span class="py-px px-2 bg-gray-800 rounded">{newVersionLabel}</span>
			</div>
			<div class="mt-4 text-sm text-center">
				Pressing the Upload button <span class="font-bold">will not</span>
				publish the new ToS version.
			</div>
		</div>
	</div>
</Popup>
