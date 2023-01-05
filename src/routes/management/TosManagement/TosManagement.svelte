<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import VerifiedCreator from '$icons/verified-creator.svelte';
	import { getParsedLegalDoc } from '$lib/components/LegalDocRenderer/LegalDocRenderer';
	import LegalDocRenderer from '$lib/components/LegalDocRenderer/LegalDocRenderer.svelte';
	import ErrorBox from '$lib/components/v2/ErrorBox/ErrorBox.svelte';
	import InfoBubbleHoverBox from '$lib/components/v2/InfoBubble/InfoBubbleHoverBox.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { apiAdminGetTosVersions, apiDiscardTosDraft, apiPublishTosDraft, type TosVersionObject } from '$utils/api/tos';
	import { setPopup } from '$utils/popup';
	import { notifyError, notifySuccess } from '$utils/toast';
	import { expoOut } from 'svelte/easing';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import ConfirmTosDraftDiscardPopup from './ConfirmTosDraftDiscardPopup.svelte';
	import ConfirmTosPublishPopup from './ConfirmTosPublishPopup.svelte';
	import CreateTosDraftPopup from './CreateTosDraftPopup.svelte';
	import CreateTosDraftSuccessPopup from './CreateTosDraftSuccessPopup.svelte';
	import DiscardTosDraftSuccessPopup from './DiscardTosDraftSuccessPopup.svelte';
	import PublishTosDraftSuccessPopup from './PublishTosDraftSuccessPopup.svelte';
	import { nextVersionLabel } from './TosManagement';

	type UI_VersionObject = TosVersionObject & { showCheck: boolean };

	let versions: UI_VersionObject[] = [];
	let versionListFetchError: string = null;
	let isFetchingVersionList = true;
	let selectedVersionId: string = null;

	$: selectedVersionObject = versions.find((i) => i._id === selectedVersionId);
	$: selectedVersionIndex = versions.indexOf(selectedVersionObject);
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
		const newVersionLabel = nextVersionLabel(versions);

		setPopup(CreateTosDraftPopup, {
			props: {
				newVersionLabel,
				onSuccess: () => {
					refreshVersionList();
					setPopup(CreateTosDraftSuccessPopup, { props: { label: newVersionLabel }, unique: true });
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
				setPopup(PublishTosDraftSuccessPopup, { props: { label: draftLabel } });
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
				setPopup(DiscardTosDraftSuccessPopup, { props: { label: draftLabel } });
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
	<div class="flex gap-4 h-[calc(100vh-18rem)]">
		<!-- List of ToS versions -->
		<div class="w-64 flex flex-col flex-shrink-0 overflow-auto border-gray-500 border blue-scrollbar">
			{#if isFetchingVersionList}
				<!-- Skeleton -->
				{#each Array(10).fill(0) as _}
					<div class="h-14 flex-shrink-0 bg-white odd:bg-opacity-5 even:bg-opacity-0 border border-transparent first:border-t-0" out:fade={{ duration: 200 }} />
				{/each}
			{:else}
				<!-- Fetched data -->
				{#each versions as version, index}
					{@const selected = selectedVersionId === version._id}
					{@const isBeforeSelected = index + 1 === selectedVersionIndex}
					<button
						class="_version_btn relative w-full h-14 flex items-center whitespace-nowrap text-white
						border-gray-500 border-b flex-shrink-0"
						class:!bg-color-purple={selected}
						class:!bg-opacity-30={selected}
						class:!border-b-0={selected}
						class:!border-b-transparent={isBeforeSelected}
						on:click={() => (selectedVersionId = version._id)}
						in:fade={{ delay: 200, duration: 500, easing: expoOut }}
					>
						<div class:gradient-border-btn-new={selected} class="w-full h-full flex items-center px-4 !border-x-0 border-transparent">
							<div class="mr-8 overflow-hidden truncate">
								{version.version}
							</div>

							{#if version.showCheck}
								<div class="absolute right-4">
									<VerifiedCreator />
								</div>
							{/if}
						</div>
					</button>
				{/each}
			{/if}

			<!-- Error message -->
			{#if versionListFetchError}
				<div class="p-2">
					<ErrorBox>
						<div slot="errorTitle">Failed to fetch version list</div>
						<div slot="errorDetail">{versionListFetchError}</div>
					</ErrorBox>
				</div>
			{/if}
		</div>

		<!-- Right side with preview and version controls -->
		<div class="border border-gray-500 rounded-sm flex-grow relative flex flex-col">
			<!-- Section with Upload New Version button -->
			<div class="flex justify-end p-4 border-b border-gray-500">
				<!-- Upload New Version button -->
				<div class="w-[38rem] flex-shrink-0">
					<InfoBubbleHoverBox>
						<div slot="bubble-content">There can be only one draft at a time.</div>
						<PrimaryButton slot="hoverable" on:click={handleUploadNewVersion} disabled={draftExists}>Upload New Version</PrimaryButton>
					</InfoBubbleHoverBox>
				</div>
			</div>

			<div class="text-white flex gap-4 p-4 items-center">
				<!-- Preview text with version label -->
				<div class="text-2xl whitespace-nowrap ml-8">
					Preview <span class="opacity-50 text-sm">
						of version: <span class="bg-black bg-opacity-20 py-1 px-2 rounded ml-2">{selectedVersionObject?.version || (isFetchingVersionList && 'loading...') || 'N/A'}</span>
					</span>
				</div>

				<div class="flex-grow w-full" />

				<!-- Publish button -->
				<div class="w-[12rem] flex-shrink-0">
					<PrimaryButton variant="green" disabled={selectedIsPublished || !selectedVersionId || isDiscarding || isPublishing} on:click={handlePublishButton}>
						{selectedIsPublished ? 'Published' : 'Publish'}
					</PrimaryButton>
				</div>

				<!-- Discard button -->
				<div class="w-[12rem] flex-shrink-0">
					<PrimaryButton variant="red" disabled={selectedIsPublished || !selectedVersionId || isDiscarding || isPublishing} on:click={handleDiscardButton}>Discard</PrimaryButton>
				</div>

				<!-- Full Preview button -->
				<div class="w-[12rem] flex-shrink-0">
					<PrimaryButton on:click={displayFullPreview} disabled={!selectedVersionId}>Full Preview</PrimaryButton>
				</div>
			</div>

			<div class="flex-grow overflow-hidden">
				{#if browser && selectedVersionObject}
					{#await getParsedLegalDoc(selectedVersionObject.html_link) then docData}
						<LegalDocRenderer {docData} loading={!docData} isContained menuTitle="Terms of Service" desktopMenuOffsetTop={0} />
					{:catch}
						<div class="m-4">
							<ErrorBox>
								<div slot="errorTitle">Failed to load document data from URL:</div>
								<div slot="errorDetail">
									<a href={selectedVersionObject.html_link} target="_blank" class="underline">{selectedVersionObject.html_link}</a>
								</div>
							</ErrorBox>
						</div>
					{/await}
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	/* ._version_btn:nth-child(odd):not(.bg-gray-900) {
		background: radial-gradient(55.65% 55.65% at 51.68% 130.43%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%),
			radial-gradient(55.22% 148.72% at 98.83% 0%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%),
			radial-gradient(64.35% 166.74% at 8.56% -7.83%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%),
			linear-gradient(180deg, rgba(136, 234, 255, 0.1) 0%, rgba(133, 141, 247, 0.056) 100%, rgba(133, 141, 247, 0.1) 100%), rgba(0, 0, 0, 0.1);
	} */
</style>
