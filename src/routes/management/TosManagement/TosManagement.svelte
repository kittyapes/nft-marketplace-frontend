<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import VerifiedCreator from '$icons/verified-creator.svelte';
	import { getParsedLegalDoc } from '$lib/components/LegalDocRenderer/LegalDocRenderer';
	import LegalDocRenderer from '$lib/components/LegalDocRenderer/LegalDocRenderer.svelte';
	import InfoBubbleHoverBox from '$lib/components/v2/InfoBubble/InfoBubbleHoverBox.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { apiAdminGetTosVersions, apiDiscardTosDraft, apiPublishTosDraft, type TosVersionObject } from '$utils/api/tos';
	import { setPopup } from '$utils/popup';
	import { notifyError, notifySuccess } from '$utils/toast';
	import { writable } from 'svelte/store';
	import ConfirmTosDraftDiscardPopup from './ConfirmTosDraftDiscardPopup.svelte';
	import ConfirmTosPublishPopup from './ConfirmTosPublishPopup.svelte';
	import CreateNewVersionPopup from './CreateVersionPopup.svelte';
	import CreateVersionSuccessPopup from './CreateVersionSuccessPopup.svelte';
	import DiscardDraftSuccessPopup from './DiscardDraftSuccessPopup.svelte';
	import PublishDraftSuccessPopup from './PublishDraftSuccessPopup.svelte';

	type UI_VersionObject = TosVersionObject & { showCheck: boolean };

	let versions: UI_VersionObject[] = [];
	let versionListFetchError: string = null;
	let isFetchingVersionList = true;
	let selectedVersionId: string = null;

	$: selectedVersionObject = versions.find((i) => i._id === selectedVersionId);
	$: selectedIsPublished = selectedVersionObject?.status === 'PUBLISHED';
	$: selectedIsDraft = selectedVersionObject?.status === 'DRAFT';
	$: draftExists = versions.some((v) => v.status === 'DRAFT');

	async function refreshVersionList() {
		isFetchingVersionList = true;

		const res = await apiAdminGetTosVersions();

		if (res.err) {
			notifyError('Failed to fetch ToS verion list. ' + res.err.message);
			versionListFetchError = res.err.message;

			isFetchingVersionList = false;

			return;
		}

		const parsedVersions: UI_VersionObject[] = [];

		let nPublished = 0;

		// Show check only on the last published version
		for (const v of res.data.data) {
			if (v.status === 'PUBLISHED') {
				nPublished++;
			}

			parsedVersions.push({ ...v, showCheck: nPublished === 1 });
		}

		versions = parsedVersions;
		selectedVersionId = versions[0]?._id;

		isFetchingVersionList = false;
	}

	// Refresh version list after coneecting a wallet once
	currentUserAddress.subscribe((addr) => {
		if (addr && !versions.length) {
			refreshVersionList();
		}
	});

	function handleUploadNewVersion() {
		setPopup(CreateNewVersionPopup, {
			props: {
				onSuccess: () => {
					refreshVersionList();
					setPopup(CreateVersionSuccessPopup, { props: { label: 'test' }, unique: true });
				},
			},
		});
	}

	// Publishing
	let isPublishing = false;

	function handlePublishButton() {
		isPublishing = true;

		const waitingApi = writable(false);
		const draftLabel = selectedVersionObject.version;

		const onPublishConfirm = async () => {
			waitingApi.set(true);

			const res = await apiPublishTosDraft(draftLabel);

			if (res.err) {
				notifyError('Failed to publish ToS draft. ' + res.err.message);
			} else {
				notifySuccess('Successfully published ToS draft.');
				handler.close();

				refreshVersionList();
				setPopup(PublishDraftSuccessPopup, { props: { label: draftLabel } });
			}

			waitingApi.set(false);
		};

		const handler = setPopup(ConfirmTosPublishPopup, {
			props: {
				label: draftLabel,
				publishing: waitingApi,
				onPublishConfirm,
			},
			closeByOutsideClick: false,
			onClose: () => {
				isPublishing = false;
				return true;
			},
		});
	}

	// Discarding
	let isDiscarding = false;

	function handleDiscardButton() {
		isDiscarding = true;

		const waitingApi = writable(false);
		const draftLabel = selectedVersionObject.version;

		const onDiscardConfirm = async () => {
			waitingApi.set(true);

			const res = await apiDiscardTosDraft(selectedVersionId);

			if (res.err) {
				notifyError('Failed to discard ToS draft.');
			} else {
				notifySuccess('Successfully discarded ToS draft.');
				handler.close();

				refreshVersionList();
				setPopup(DiscardDraftSuccessPopup, { props: { label: draftLabel } });
			}

			waitingApi.set(false);
		};

		const handler = setPopup(ConfirmTosDraftDiscardPopup, {
			props: {
				label: draftLabel,
				discarding: waitingApi,
				onDiscardConfirm,
			},
			closeByOutsideClick: false,
			onClose: () => {
				isDiscarding = false;
				return true;
			},
		});
	}

	// Full preview
	function displayFullPreview() {
		goto('./management/preview/' + selectedVersionObject.version);
	}
</script>

<div>
	<div class="h-px mb-8 bg-gray-200" />

	<div class="flex gap-4 items-center">
		<div class="w-64 flex-shrink-0">
			<InfoBubbleHoverBox>
				<div slot="bubble-content">There can be only one draft at a time.</div>
				<PrimaryButton slot="hoverable" on:click={handleUploadNewVersion} disabled={draftExists}>Create New Draft</PrimaryButton>
			</InfoBubbleHoverBox>
		</div>

		<div class="flex-grow flex gap-2 items-center h-10">
			<!-- {#if !selectedVersionObject}
				<div class="w-32 h-full bg-gray-100 rounded" />
			{:else if selectedVersionObject?.published}
				<div class="w-32 font-medium gradient-text">Published</div>
			{:else}
				<div class="w-32 font-medium">Not published</div>
			{/if} -->

			<button class="rounded bg-gray-200 px-4 py-2 font-semibold btn" disabled={selectedIsPublished || !selectedVersionId || isDiscarding || isPublishing} on:click={handlePublishButton}>
				{selectedIsPublished ? 'Published' : 'Publish'}
			</button>

			<button class="rounded bg-gray-200 px-4 py-2 font-semibold btn" disabled={selectedIsPublished || !selectedVersionId || isDiscarding || isPublishing} on:click={handleDiscardButton}>
				Discard
			</button>

			{#if selectedIsPublished}
				<VerifiedCreator />
			{/if}

			<div class="flex-grow" />

			<div class="font-semibold rounded h-full flex items-center whitespace-nowrap" class:bg-gray-100={isFetchingVersionList} class:text-transparent={isFetchingVersionList}>Version label:</div>
			<div class="min-w-[10rem] bg-gray-100 rounded flex items-center px-2 h-full">{selectedVersionObject?.version || ''}</div>
		</div>
	</div>

	<div class="flex gap-4 mt-6 h-[calc(100vh-18rem)]">
		<!-- List of ToS versions -->
		<div class="w-64 border p-4 rounded-sm gap-2 flex flex-col flex-shrink-0 overflow-auto">
			{#if isFetchingVersionList}
				<!-- Skeleton -->
				{#each Array(10).fill(0) as _}
					<div class="h-12 flex-shrink-0 bg-gray-100 rounded-md animate-pulse" />
				{/each}
			{:else}
				<!-- Fetched data -->
				{#each versions as version}
					<button
						class="relative bg-gray-100 w-full h-12 flex items-center px-4 rounded-md font-semibold whitespace-nowrap border border-gray-100 hover:border-gray-300"
						class:!border-color-purple={selectedVersionId === version._id}
						class:text-gray-500={version.status === 'PUBLISHED' && !version.showCheck}
						on:click={() => (selectedVersionId = version._id)}
					>
						<div class="mr-8 overflow-hidden truncate">
							{version.version}
						</div>

						{#if version.showCheck}
							<div class="absolute right-2">
								<VerifiedCreator />
							</div>
						{/if}
					</button>
				{/each}
			{/if}

			<!-- Error message -->
			{#if versionListFetchError}
				<div class="bg-red-400 text-white px-4 py-2 rounded font-medium">Failed to fetch TOS version list: {versionListFetchError}</div>
			{/if}
		</div>

		<div class="border rounded-sm flex-grow relative">
			<button class="absolute top-4 right-8 bg-gray-100 rounded px-4 py-2 btn border" on:click={displayFullPreview} disabled={!selectedVersionId}>Full Preview</button>
			{#if browser && selectedVersionObject}
				{#await getParsedLegalDoc(selectedVersionObject.html_link) then docData}
					<LegalDocRenderer {docData} loading={!docData} isContained menuTitle="Terms of Service" desktopMenuOffsetTop={10} />
				{:catch}
					<div class="err-box m-4 mr-44">
						Failed to load document data from <a href={selectedVersionObject.html_link} target="_blank" class="underline">{selectedVersionObject.html_link}</a>
					</div>
				{/await}
			{/if}
		</div>
	</div>
</div>
