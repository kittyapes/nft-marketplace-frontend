<script lang="ts">
	import Loader from '$icons/loader.svelte';
	import PersonIcon from '$icons/person.svelte';
	import ModifyUser from '$lib/components/admin/ModifyUser.svelte';
	import EthAddress from '$lib/components/EthAddress.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { getAdmins } from '$utils/api/admin/adminManagement';
	import { setPopup } from '$utils/popup';
	import { httpErrorHandler } from '$utils/toast';
	import type { UserData } from 'src/interfaces/userData';

	function handleModifyAdmin(userData) {
		setPopup(ModifyUser, { props: { userData } });
	}

	let admins: UserData[] = null;

	let isFetching = false;

	async function fetchAdmins() {
		if (!$currentUserAddress) return;
		isFetching = true;
		admins = await getAdmins().catch(httpErrorHandler);
		isFetching = false;
	}

	$: $currentUserAddress && !admins && fetchAdmins();
</script>

<div class="mt-32">
	<div class="flex items-baseline justify-between w-full">
		<div class="text-lg font-bold uppercase ">Administrators</div>
	</div>

	<div class="max-h-[900px] overflow-auto custom-scrollbar mt-5 pb-4">
		{#if isFetching}
			<Loader class="ml-0" />
		{/if}

		<table class="table w-full border-t table-auto border-color-black border-opacity-30">
			{#each admins || [] as row}
				{@const showModify = row.address !== $currentUserAddress && row.roles !== 'superadmin'}

				<tr class="h-20 border-b border-color-black border-opacity-30">
					<td class="px-4">
						<div class="flex items-center gap-4">
							<PersonIcon />
							<EthAddress address={row.address} concat />
						</div>
					</td>

					<td class="px-6">
						<span class="font-bold">Username:</span>
						{row.username}
					</td>

					<td class="px-6">
						<span class="font-bold">Status:</span>
						{row.roles || 'No roles'}
					</td>

					<td class="px-4 w-28 whitespace-nowrap">
						{#if showModify}
							<button class="w-48 h-12 font-light uppercase btn btn-rounded btn-gradient" on:click={() => handleModifyAdmin(row)}>Modify</button>
						{/if}
					</td>
				</tr>
			{/each}
		</table>
	</div>
</div>
