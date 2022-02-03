<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import EthAddress from '$lib/components/EthAddress.svelte';
	import PersonIcon from '$icons/person.svelte';

	let usernames = ['Username', 'LongerUsername', 'Shrt'];

	const QUEUE_ROWS = Array(10)
		.fill(0)
		.map((_) => ({
			username: usernames[Math.floor(Math.random() * usernames.length)],
			address: '0x3468C6dE9662C2877vd10184B4228e5711b89D42',
			date: '12-01-21 02:21:34'
		}));
</script>

<div class="mt-12">
	<div class="flex justify-between">
		<div class="uppercase text-lg font-bold">Verification Queue</div>
		<div class="uppercase text-lg font-bold">Date added</div>
	</div>

	<div class="max-h-96 overflow-y-auto overflow-x-auto mt-5">
		<table class="w-full table-auto border-t border-color-black border-opacity-30">
			{#each QUEUE_ROWS as row}
				<tr class="h-20 border-b border-color-black border-opacity-30">
					<td class="px-2"><Checkbox /> </td>

					<td class="px-2">
						<div class="flex items-center gap-4">
							<PersonIcon />
							{row.username}
						</div>
					</td>

					<td class="px-2 max-w-full whitespace-nowrap">
						<EthAddress address={row.address} />
					</td>

					<td class="px-4 w-28 whitespace-nowrap">{row.date}</td>
				</tr>
			{/each}
		</table>
	</div>

	<div class="flex gap-5 mt-5">
		<Button class="text-xs" gradient rounded>Approve</Button>
		<Button class="text-xs" gradient rounded>Reject</Button>
	</div>
</div>
