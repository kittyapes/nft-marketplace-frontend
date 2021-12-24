<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import EthAddress from '$lib/components/EthAddress.svelte';
	import PersonIcon from '$icons/person.svelte';
	import { goto } from '$app/navigation';
	import ModifyAdmin from '$lib/components/admin/ModifyAdmin.svelte';

	let modifyAdminOpen = false;

	// TODO Remove this
	let usernames = ['Username', 'KindaLongerUsername', 'Shrt'];
	let boolStates = [true, false];
	let statuses = ['Super Admin', 'Admin'];

	const QUEUE_ROWS = Array(10)
		.fill(0)
		.map((_) => ({
			username: usernames[Math.floor(Math.random() * usernames.length)],
			address: '0x3468C6dE9662C2877vd10184B4228e5711b89D42',
			status: statuses[Math.floor(Math.random() * statuses.length)],
			active: boolStates[Math.floor(Math.random() * boolStates.length)]
		}));
</script>

<div class="mt-32">
	{#if modifyAdminOpen}
		<ModifyAdmin on:close={() => (modifyAdminOpen = false)} />
	{/if}

	<div class="w-full flex justify-between items-baseline">
		<div class="uppercase text-lg font-bold ">Administrators</div>
		<Button
			variant="rounded-outline"
			class="!w-28 text-xs py-1"
			on:click={() => goto('/admin/users/add-admin')}>Add</Button
		>
	</div>

	<div class="max-h-[900px] overflow-y-auto overflow-x-auto mt-5">
		<table class="w-full table table-auto border-t border-color-black border-opacity-30">
			{#each QUEUE_ROWS as row}
				<tr class="h-20 border-b border-color-black border-opacity-30">
					<td class="px-4">
						<div class="flex items-center gap-4">
							<PersonIcon />
							<EthAddress address={row.address} concat />
						</div>
					</td>

					<td class="px-6"> <span class="font-bold">Username:</span> {row.username} </td>

					<td class="px-6"> <span class="font-bold">Status:</span> {row.status} </td>

					<td class="px-4 w-28 whitespace-nowrap">
						<Button
							class="!w-40 text-xs"
							on:click={() => {
								modifyAdminOpen = true;
							}}
						>
							Modify
						</Button>
					</td>
				</tr>
			{/each}
		</table>
	</div>
</div>
