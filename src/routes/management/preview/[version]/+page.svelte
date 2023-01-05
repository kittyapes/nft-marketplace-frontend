<script lang="ts">
	import { page } from '$app/stores';
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { apiAdminGetTosVersions, type TosVersionObject } from '$utils/api/tos';
	import { notifyError } from '$utils/toast';
	import LegalDocRenderer from '$lib/components/LegalDocRenderer/LegalDocRenderer.svelte';
	import { getParsedLegalDoc } from '$lib/components/LegalDocRenderer/LegalDocRenderer';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	const versionLabel = $page.params.version;

	let versionData: TosVersionObject;

	let loading = true;

	async function loadVersionData() {
		loading = true;

		// We didn't get an endpoint to fetch a single version. :(
		const resTosVersions = await apiAdminGetTosVersions();

		if (resTosVersions.err) {
			notifyError('Failed to load ToS version');
			return;
		}

		// Find version that is to be previewed.
		versionData = resTosVersions.data.data.find((v) => v.version === versionLabel);

		loading = false;
	}

	// Load version data on wallet connection
	currentUserAddress.subscribe((address) => {
		if (address && !versionData) {
			loadVersionData();
		}
	});

	function goBack() {
		goto('/management?tab=TOS');
	}

	$: console.log(versionData);
</script>

{#if loading}
	<DiamondsLoader />
{:else}
	<div class="px-6 py-4 bg-color-blue fixed w-full z-10 flex items-center justify-end gap-4 flex-wrap md:flex-nowrap">
		<div class="flex-grow text-center">
			You are viewing a draft of a new version of the Terms of Service document. The label of this draft version is <span class="bg-white bg-opacity-50 px-2 py-px rounded whitespace-nowrap">
				{versionLabel}
			</span>
			.
		</div>
		<button class="btn font-semibold bg-gray-100 px-3 py-1 rounded" on:click={goBack}>Go Back</button>
	</div>

	<div class="mt-12">
		{#if browser && versionData}
			{#await getParsedLegalDoc(versionData.html_link) then docData}
				<LegalDocRenderer {docData} loading={!docData} menuTitle="Terms of Service" desktopMenuOffsetTop={40} />
			{:catch}
				<div class="err-box m-4 mt-24">
					Failed to load document data from <a href={versionData.html_link} target="_blank" class="underline">{versionData.html_link}</a>
				</div>
			{/await}
		{/if}
	</div>
{/if}
