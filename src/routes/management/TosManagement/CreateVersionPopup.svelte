<script lang="ts">
	import Popup from '$lib/components/Popup.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { apiPostNewTosVersion } from '$utils/api/tos';
	import type { PopupHandler } from '$utils/popup';
	import { notifyError, notifySuccess } from '$utils/toast';

	export let handler: PopupHandler;
	export let onSuccess: () => any = null;

	let generatedVersionLabel: string = null;
	let isWorking = false;

	async function handleUpload() {
		isWorking = true;

		generatedVersionLabel = new Date().toISOString();

		const res = await apiPostNewTosVersion(generatedVersionLabel, pdfUrl, htmlUrl);

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
	<div class="py-8 px-12 max-w-3xl">
		<div class="text-2xl font-semibold">Upload new Terms of Service documents</div>
		<div class="mt-4">Please provide links to both, the PDF document and the HTML document.</div>
		<div class="mt-3">
			The PDF file retrieved from the URL and hashed. Each user will be required to sign the hash of this document with their private key. This signature will then be saved in case you need it for
			legal purposes.
		</div>
		<div class="mt-3">
			The HTML file will be used for styled ToS rendering on the website. This version will not be hashed and will not be used for signatures. This version cannot be used for legal purposes.
		</div>

		<div class="mt-6">
			<TextInput placeholder="URL to PDF file" grayOutline bind:value={pdfUrl} />
		</div>

		<div class="mt-2">
			<TextInput placeholder="URL to HTML file" grayOutline bind:value={htmlUrl} />
		</div>

		<div class="font-medium mt-4">
			Generated version label: <span class="py-px px-2 bg-gray-100 rounded">{generatedVersionLabel || 'N/A'}</span>
		</div>

		<div class="mt-16">
			<PrimaryButton on:click={handleUpload} disabled={!isPdfUrlValid || !isHtmlUrlValid || isWorking}>
				{#if isWorking}
					<ButtonSpinner />
				{/if}

				Upload
			</PrimaryButton>
		</div>

		<div class="mt-4 text-sm text-center">
			Pressing the Upload button <span class="font-bold">will not</span>
			publish the new ToS version.
		</div>
	</div>
</Popup>
