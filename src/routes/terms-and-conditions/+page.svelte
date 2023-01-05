<script lang="ts">
	import { getParsedLegalDoc, type LegalDocData } from '$lib/components/LegalDocRenderer/LegalDocRenderer';
	import LegalDocRenderer from '$lib/components/LegalDocRenderer/LegalDocRenderer.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { apiGetLatestTosVersion } from '$utils/api/tos';
	import { notifyError } from '$utils/toast';

	let loading = true;
	let docData: LegalDocData;

	async function fetchDoc() {
		loading = true;

		const resLatest = await apiGetLatestTosVersion();

		if (resLatest.err) {
			notifyError('Failed to load data about the latest ToS version.');

			loading = false;

			return;
		}

		docData = await getParsedLegalDoc(resLatest.data.data.html_link);

		loading = false;
	}

	$: $currentUserAddress && fetchDoc();
</script>

<LegalDocRenderer {docData} {loading} menuTitle="Terms of Use" />
