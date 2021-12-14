<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import EthAddress from '$lib/components/EthAddress.svelte';

	const QUEUE_ROWS = Array(5)
		.fill(0)
		.map((_) => ({
			username: 'Username',
			address: '0x3468C6dE9662C2877vd10184B4228e5711b89D42',
			date: '12-01-21 02:21:34 '
		}));

	console.log(QUEUE_ROWS);
</script>

<div class="mt-12">
	<div class="uppercase text-lg font-bold">Verification Queue</div>

	<div class="max-h-96 overflow-y-scroll  mt-5">
		<table class="w-full  border-solid border table-auto">
			{#each QUEUE_ROWS as row}
				<tr class="h-20 ">
					<td class="px-2"><Checkbox /> </td>
					<td class="px-2">*</td>
					<td class="px-2">{row.username}</td>
					<td class="px-2 max-w-full whitespace-nowrap">
						<EthAddress address={row.address} />
					</td>
					<td class="px-2 w-28 whitespace-nowrap">{row.date}</td>
				</tr>
			{/each}
		</table>
	</div>

	<div class="flex gap-5 mt-5">
		<Button variant="rounded-gradient" class="text-xs">Approve</Button>
		<Button variant="rounded-gradient" class="text-xs">Reject</Button>
	</div>
</div>
