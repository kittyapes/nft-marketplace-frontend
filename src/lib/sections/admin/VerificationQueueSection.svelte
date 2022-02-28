<script lang="ts">
	import Checkbox from '$lib/components/Checkbox.svelte';
	import EthAddress from '$lib/components/EthAddress.svelte';
	import PersonIcon from '$icons/person.svelte';
	import type { VerificationQueueItem } from '$utils/api/admin/userManagement';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let queue: VerificationQueueItem[] = [];
	export let selectedAddresses: VerificationQueueItem[] = [];
	export let disabled = false;

	function handleCheck(row) {
		selectedAddresses.push(row);
		selectedAddresses = selectedAddresses;
	}

	function handleUncheck(row) {
		selectedAddresses = selectedAddresses.filter((v) => v.address != row.address);
	}

	function getSelectedAddresses() {
		return selectedAddresses.map((v) => v.address);
	}

	function handleBatchApprove() {
		dispatch('batchApprove', { rows: selectedAddresses, addresses: getSelectedAddresses() });
	}

	function handleBatchReject() {
		dispatch('batchReject', { rows: selectedAddresses, addresses: getSelectedAddresses() });
	}
</script>

<div class="mt-12">
	<div class="flex justify-between">
		<div class="text-lg font-bold uppercase">Verification Queue</div>
		<div class="mr-16 text-lg font-bold uppercase">Date added</div>
	</div>

	<div class="pb-4 pr-8 mt-5 overflow-auto max-h-96 custom-scrollbar">
		<table class="w-full border-t table-auto border-color-black border-opacity-30">
			{#each queue as row}
				<tr class="h-20 border-b border-color-black border-opacity-30" class:opacity-50={disabled}>
					<td class="px-2">
						<Checkbox
							on:checked={() => handleCheck(row)}
							on:unchecked={() => handleUncheck(row)}
							{disabled}
						/>
					</td>

					<td class="px-2">
						<div class="flex items-center gap-4">
							<PersonIcon />
							{row.address}
						</div>
					</td>

					<td class="max-w-full px-2 whitespace-nowrap">
						<EthAddress address={row.address} />
					</td>

					<td class="px-4 w-28 whitespace-nowrap">{row.dateAdded}</td>
				</tr>
			{/each}
		</table>
	</div>

	<div class="flex gap-5 mt-5">
		<button
			class="w-48 italic font-light uppercase btn btn-gradient btn-rounded disabled:opacity-50"
			on:click={handleBatchApprove}
			{disabled}
		>
			Approve
		</button>

		<button
			class="w-48 italic font-light uppercase btn btn-gradient btn-rounded disabled:opacity-50"
			on:click={handleBatchReject}
			{disabled}
		>
			Reject
		</button>
	</div>
</div>
