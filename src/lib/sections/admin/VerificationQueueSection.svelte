<script lang="ts">
	import Checkbox from '$lib/components/Checkbox.svelte';
	import EthAddress from '$lib/components/EthAddress.svelte';
	import PersonIcon from '$icons/person.svelte';
	import type { VerificationQueueItem } from '$utils/api/admin/userManagement';

	export let queue: VerificationQueueItem[] = [];
</script>

<div class="mt-12">
	<div class="flex justify-between">
		<div class="text-lg font-bold uppercase">Verification Queue</div>
		<div class="mr-16 text-lg font-bold uppercase">Date added</div>
	</div>

	<div class="pb-4 pr-8 mt-5 overflow-auto max-h-96 custom-scrollbar">
		<table class="w-full border-t table-auto border-color-black border-opacity-30">
			{#each queue as row}
				<tr class="h-20 border-b border-color-black border-opacity-30">
					<td class="px-2"><Checkbox /></td>

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
		<button class="w-48 italic font-light uppercase btn btn-gradient btn-rounded">Approve</button>
		<button class="w-48 italic font-light uppercase btn btn-gradient btn-rounded">Reject</button>
	</div>
</div>
