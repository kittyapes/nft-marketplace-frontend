<script lang="ts">
	import Loader from '$icons/loader.svelte';
	import PersonIcon from '$icons/person.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import EthAddress from '$lib/components/EthAddress.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import {
		forceBatchProcess,
		getBatchProcessSettings,
		putBatchProcessSettings
	} from '$utils/api/admin/batchProcessing';
	import { getVerificationQueue, postVerificationQueueAdd } from '$utils/api/admin/userManagement';
	import { makeErrorHandler, makeSuccessHandler, notifyError, notifySuccess } from '$utils/toast';
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

		await postVerificationQueueAdd(addressToAdd)
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
		isRefreshingBatchProcessSettings = true;

		const settings = await getBatchProcessSettings();

		isBatchProcessEnabled.set(settings.enabled);
		batchProcessDayOption.set(processDayOptions[settings.processingDayIndex]);

		isRefreshingBatchProcessSettings = false;
	}

	$: $currentUserAddress && refreshBatchProcessSettings();

	$: console.log('processing enabled', $isBatchProcessEnabled);

	let isPushingBatchProcessSettings = false;

	async function pushBatchProcessSettings() {
		isPushingBatchProcessSettings = true;

		await putBatchProcessSettings({
			enabled: $isBatchProcessEnabled,
			processingDayIndex: $batchProcessDayOption.index
		})
			.then(makeSuccessHandler('Successfully updated batch processing settings.'))
			.catch((e) => notifyError(e.message));

		isPushingBatchProcessSettings = false;
	}

	// Verification queue fetch
	const verificationQueueSort = writable(sortByOptions[0]);
	let queueItems = [];

	let isRefreshingQueue = false;

	async function fetchVerificationQueueItems() {
		isRefreshingQueue = true;
		const res = await getVerificationQueue($verificationQueueSort.value as any).catch(
			makeErrorHandler('Failed to fetch verification queue!')
		);

		queueItems = res || [];
		isRefreshingQueue = false;
	}

	onMount(fetchVerificationQueueItems);

	verificationQueueSort.subscribe(fetchVerificationQueueItems);
</script>

<!-- Add verified Creator -->
<div class="mt-12 text-lg font-bold uppercase">Verification Queue</div>

<div class="flex items-center mt-7 gap">
	<input
		type="text"
		class="w-[500px] px-8 bg-[#F7F7F7] border border-[#CDCDCD] rounded-md font-light h-14 outline-none disabled:opacity-50"
		placeholder="Enter an address to add to Verified Creators..."
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

	<div class="flex-grow" />

	<!-- Verification queue sort by dropdown -->
	<div class="flex items-center">
		<span class="pr-4 whitespace-nowrap">Sort By</span>
		<div>
			<Dropdown options={sortByOptions} class="w-40" bind:selected={$verificationQueueSort} />
		</div>
	</div>
</div>

<!-- Verification queue table -->
<div class="pb-4 pr-8 mt-5 overflow-auto max-h-96 custom-scrollbar">
	{#if isRefreshingQueue}
		<Loader class="ml-0" />
	{/if}

	{#if queueItems.length}
		<table class="w-full table-auto">
			<tr class="h-20">
				<th />
				<th />
				<th class="font-bold uppercase whitespace-nowrap">Date Added</th>
			</tr>

			{#each queueItems as row}
				<tr class="h-20 border-t border-color-black border-opacity-30">
					<td class="px-2">
						<div class="flex items-center gap-4">
							<PersonIcon />
							{row.address}
						</div>
					</td>

					<td class="max-w-full px-2 font-mono whitespace-nowrap">
						<EthAddress address={row.address} />
					</td>

					<td class="px-4 w-28 whitespace-nowrap">{row.dateAdded || 'N/A'}</td>
				</tr>
			{/each}
		</table>
	{/if}
</div>

<!-- Verification queue options -->
<div class="flex items-center justify-between w-full mt-12">
	<div class="flex flex-wrap gap-3 pb-2 lg:flex-row">
		<div class="flex items-center gap-3 whitespace-nowrap">
			Automatic Batch Processing
			<Checkbox
				bind:checked={$isBatchProcessEnabled}
				disabled={isPushingBatchProcessSettings || isRefreshingBatchProcessSettings}
				on:change={pushBatchProcessSettings}
			/>
		</div>

		<div class="flex items-center mr-4 space-x-4">
			<span class="pr-1 whitespace-nowrap">Process Every</span>
			<Dropdown
				class="w-36"
				options={processDayOptions}
				disabled={isPushingBatchProcessSettings || isRefreshingBatchProcessSettings}
				bind:selected={$batchProcessDayOption}
				on:select={pushBatchProcessSettings}
			/>
		</div>

		<button
			class="btn-secondary"
			on:click={handleForceBatchProcess}
			disabled={isForceBatchProcessing || isRefreshingBatchProcessSettings}
		>
			Force processing now
		</button>
	</div>
</div>

{#if isRefreshingBatchProcessSettings || isPushingBatchProcessSettings}
	<Loader class="ml-0" />
{/if}
