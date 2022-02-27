<script lang="ts">
	import Checkbox from '$lib/components/Checkbox.svelte';
	import VerificationQueueSection from '$lib/sections/admin/VerificationQueueSection.svelte';
	import VerifiedCreatorsSection from '$lib/sections/admin/VerifiedCreatorsSection.svelte';
	import AdministratorsSection from '$lib/sections/admin/AdministratorsSection.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import { addToVerificationQueue } from '$utils/api/admin/userManagement';
	import { notifyError, notifySuccess } from '$utils/toast';
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

	const sortByOptions = [{ label: 'Date' }, { label: 'Alphabetical' }];

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

	let isForceBatchProcessing = false;

	async function handleForceBatchProcess() {
		isForceBatchProcessing = true;

		await forceBatchProcess()
			.then(() => notifySuccess('Batch processed.'))
			.catch((e) => notifyError(e.message));

		isForceBatchProcessing = false;
	}

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
</script>

<div class="w-full min-h-screen h-full flex flex-col md:flex-row overflow-x-hidden">
	<div class="px-20 py-16 w-full overflow-x-auto">
		<div class="text-4xl uppercase font-bold">User management</div>

		<!-- Add verified Creator -->
		<div class="uppercase text-lg font-bold mt-12">Add Verified Creator</div>

		<div class="mt-7 flex gap items-center">
			<input
				type="text"
				class="w-[500px] px-8 bg-[#F7F7F7] border border-[#CDCDCD] rounded-md font-light h-14 outline-none disabled:opacity-50"
				placeholder="Enter an address to add to the Verified Creators..."
				autocomplete="nope"
				bind:value={addressToAdd}
				disabled={isAddingToQueue}
			/>

			<button
				class="btn-secondary italic h-12 ml-8"
				on:click={handleAddToQueue}
				disabled={isAddingToQueue || !addressToAdd}
			>
				Add to queue
			</button>
		</div>

		<div class="w-full flex items-center mt-12 justify-between">
			<div class="flex gap-3 lg:flex-row pb-2 flex-wrap">
				<div class="flex items-center gap-3 whitespace-nowrap">
					Automatic Batch Processing
					<Checkbox
						bind:checked={$isBatchProcessEnabled}
						disabled={isPushingBatchProcessSettings}
					/>
				</div>

				<div class="flex items-center space-x-4 mr-4">
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
						<Dropdown options={sortByOptions} class="w-40" />
					</div>
				</div>
			</div>
		</div>

		<VerificationQueueSection />
		<VerifiedCreatorsSection />
		<AdministratorsSection />
	</div>
</div>
