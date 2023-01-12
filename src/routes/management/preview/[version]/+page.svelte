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
	import ErrorBox from '$lib/components/v2/ErrorBox/ErrorBox.svelte';

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

	// Mobile doc offset
	let barClientHeight = 0;
</script>

{#if loading}
	<DiamondsLoader />
{:else}
	<div class="px-6 py-4 bg-color-purple bg-opacity-20 fixed w-full z-10 flex items-center justify-end gap-4 flex-wrap md:flex-nowrap backdrop-blur-xl" bind:clientHeight={barClientHeight}>
		<div class="flex-grow text-center text-white">
			You are viewing a draft of a new version of the Terms of Service document. The label of this draft version is <span
				class="bg-black bg-opacity-30 ml-[0.1rem] px-2 py-1 rounded whitespace-nowrap"
			>
				{versionLabel}
			</span>
			.
		</div>
		<button class="btn bg-black bg-opacity-40 text-white px-3 py-1 rounded" on:click={goBack}>Go Back</button>
	</div>

	<div style="margin-top: calc({barClientHeight}px - 4rem);">
		{#if browser && versionData}
			{#await getParsedLegalDoc(versionData.html_link) then docData}
				<LegalDocRenderer {docData} loading={!docData} menuTitle="Terms of Service" desktopMenuOffsetTop={40} />
			{:catch}
				<div class="mt-20 m-4">
					<ErrorBox>
						<div slot="errorTitle">Failed to load document data from URL:</div>
						<div slot="errorDetail">
							<a href={versionData.html_link} target="_blank" class="underline">{versionData.html_link}</a>
						</div>
					</ErrorBox>
				</div>
			{/await}
		{/if}
	</div>
{/if}
