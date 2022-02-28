<script lang="ts">
	import Checkbox from '$lib/components/Checkbox.svelte';
	import VerificationQueueSection from '$lib/sections/admin/VerificationQueueSection.svelte';
	import VerifiedCreatorsSection from '$lib/sections/admin/VerifiedCreatorsSection.svelte';
	import AdministratorsSection from '$lib/sections/admin/AdministratorsSection.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import {
		addToVerificationQueue,
		approveFromVerificationQueue,
		getVerificationQueue,
		rejectFromVerificationQueue
	} from '$utils/api/admin/userManagement';
	import { httpErrorHandler, makeErrorHandler, notifyError, notifySuccess } from '$utils/toast';
	import {
		forceBatchProcess,
		getBatchProcessSettings,
		putBatchProcessSettings
	} from '$utils/api/admin/batchProcessing';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const processDayOptions = [
		{ label: 'Monday', index: 0 },
		{ label: 'Tuesday', index: 1 },
		{ label: 'Wednesday', index: 2 },
		{ label: 'Thrusday', index: 3 },
		{ label: 'Friday', index: 4 },
		{ label: 'Saturday', index: 5 },
		{ label: 'Sunday', index: 6 }
	];

	const sortByOptions = [
		{ label: 'Date', value: 'date' },
		{ label: 'Alphabetical', value: 'alphabetical' }
	];

	let addressToAdd: string;

	let isAddingToQueue = false;

	async function handleAddToQueue() {
		isAddingToQueue = true;

		await addToVerificationQueue(addressToAdd)
			.then(() => notifySuccess('Added to queue'))
			.catch((e) => notifyError(e.message));

		isAddingToQueue = false;
		addressToAdd = '';
	}

	// Force batch processing
	let isForceBatchProcessing = false;

	async function handleForceBatchProcess() {
		isForceBatchProcessing = true;

		await forceBatchProcess()
			.then(() => notifySuccess('Batch processed.'))
			.catch((e) => notifyError(e.message));

		isForceBatchProcessing = false;
	}

	// Batch processing settings
	const isBatchProcessEnabled = writable(null);
	const batchProcessDayOption = writable(processDayOptions[0]);
	let isRefreshingBatchProcessSettings = false;

	async function refreshBatchProcessSettings() {
		isRefreshingBatchProcessSettings = false;

		const settings = await getBatchProcessSettings();

		isBatchProcessEnabled.set(settings.enabled);
		batchProcessDayOption.set(processDayOptions[settings.processingDayIndex]);

		isRefreshingBatchProcessSettings = true;
	}

	let isPushingBatchProcessSettings = false;

	async function pushBatchProcessSettings() {
		isPushingBatchProcessSettings = true;
		await putBatchProcessSettings({
			enabled: $isBatchProcessEnabled,
			processingDayIndex: $batchProcessDayOption.index
		}).catch((e) => notifyError(e.message));
		isPushingBatchProcessSettings = false;
	}

	isBatchProcessEnabled.subscribe(
		() => isRefreshingBatchProcessSettings && pushBatchProcessSettings()
	);
	batchProcessDayOption.subscribe(
		() => isRefreshingBatchProcessSettings && pushBatchProcessSettings()
	);

	onMount(refreshBatchProcessSettings);

	// Verification queue fetch
	const verificationQueueSort = writable(sortByOptions[0]);
	let verificationQueueItems = [];

	async function fetchVerificationQueueItems() {
		const res = await getVerificationQueue($verificationQueueSort.value as any).catch(
			makeErrorHandler('Failed to fetch verification queue!')
		);

		verificationQueueItems = res || [];
	}

	onMount(fetchVerificationQueueItems);

	verificationQueueSort.subscribe(fetchVerificationQueueItems);

	// Verification queue batch operations
	let isChangingVerificationQueue = false;

	async function handleVerificationQueueBatchApprove(event) {
		isChangingVerificationQueue = true;
		await approveFromVerificationQueue(event.detail.addresses)
			.then(() => notifySuccess('Approved addresses.'))
			.catch(httpErrorHandler);
		await fetchVerificationQueueItems();
		isChangingVerificationQueue = false;
	}

	async function handleVerificationQueueBatchReject(event) {
		isChangingVerificationQueue = true;
		await rejectFromVerificationQueue(event.detail.addresses)
			.then(() => notifySuccess('Rejected addresses.'))
			.catch(httpErrorHandler);
		await fetchVerificationQueueItems();
		isChangingVerificationQueue = false;
	}

	$: console.log(verificationQueueItems);
</script>

<div class="flex flex-col w-full h-full min-h-screen overflow-x-hidden md:flex-row">
	<div class="w-full px-20 py-16 overflow-x-auto">
		<div class="text-4xl font-bold uppercase">User management</div>

		<!-- Add verified Creator -->
		<div class="mt-12 text-lg font-bold uppercase">Add Verified Creator</div>

		<div class="flex items-center mt-7 gap">
			<input
				type="text"
				class="w-[500px] px-8 bg-[#F7F7F7] border border-[#CDCDCD] rounded-md font-light h-14 outline-none disabled:opacity-50"
				placeholder="Enter an address to add to the Verified Creators..."
				autocomplete="nope"
				bind:value={addressToAdd}
				disabled={isAddingToQueue}
			/>

			<button
				class="h-12 ml-8 italic btn-secondary"
				on:click={handleAddToQueue}
				disabled={isAddingToQueue || !addressToAdd}
			>
				Add to queue
			</button>
		</div>

		<div class="flex items-center justify-between w-full mt-12">
			<div class="flex flex-wrap gap-3 pb-2 lg:flex-row">
				<div class="flex items-center gap-3 whitespace-nowrap">
					Automatic Batch Processing
					<Checkbox
						bind:checked={$isBatchProcessEnabled}
						disabled={isPushingBatchProcessSettings}
					/>
				</div>

				<div class="flex items-center mr-4 space-x-4">
					<span class="pr-1 whitespace-nowrap">Process Every</span>
					<Dropdown
						options={processDayOptions}
						disabled={isPushingBatchProcessSettings}
						bind:selected={$batchProcessDayOption}
						class="w-36"
					/>
				</div>

				<button
					class="btn-secondary"
					on:click={handleForceBatchProcess}
					disabled={isForceBatchProcessing}
				>
					Force processing now
				</button>

				<div class="flex items-center">
					<span class="pr-4 whitespace-nowrap">Sort By</span>
					<div>
						<Dropdown options={sortByOptions} class="w-40" bind:selected={$verificationQueueSort} />
					</div>
				</div>
			</div>
		</div>

		<VerificationQueueSection
			queue={verificationQueueItems}
			on:batchApprove={handleVerificationQueueBatchApprove}
			on:batchReject={handleVerificationQueueBatchReject}
			disabled={isChangingVerificationQueue}
		/>
		<VerifiedCreatorsSection />
		<AdministratorsSection />
	</div>
</div>
