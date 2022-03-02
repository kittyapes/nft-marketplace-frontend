<script lang="ts">
	import EthAddress from '$lib/components/EthAddress.svelte';
	import PersonIcon from '$icons/person.svelte';
	import ModifyUser from '$lib/components/admin/ModifyUser.svelte';
	import { setPopup } from '$utils/popup';

	function handleModifyAdmin(userData) {
		setPopup(ModifyUser, { props: { userData } });
	}
</script>

<div class="mt-32">
	<div class="w-full flex justify-between items-baseline">
		<div class="uppercase text-lg font-bold ">Administrators</div>
		<a
			href="/admin/users/add-admin"
			class="btn btn-rounded uppercase italic btn-outline h-12 font-light"
		>
			Add
		</a>
	</div>

	<div class="max-h-[900px] overflow-auto custom-scrollbar mt-5 pb-4">
		<table class="w-full table table-auto border-t border-color-black border-opacity-30">
			{#each [{ address: '0x40D6f8Ac990d98F9c812A3910e3255345fB32f8e', name: 'Jakub', role: 'admin' }] as row}
				<tr class="h-20 border-b border-color-black border-opacity-30">
					<td class="px-4">
						<div class="flex items-center gap-4">
							<PersonIcon />
							<EthAddress address={row.address} concat />
						</div>
					</td>

					<td class="px-6">
						<span class="font-bold">Username:</span>
						{row.name}
					</td>

					<td class="px-6">
						<span class="font-bold">Status:</span>
						{row.role}
					</td>

					<td class="px-4 w-28 whitespace-nowrap">
						<button
							class="btn btn-rounded uppercase italic btn-gradient h-12 w-48 font-light"
							on:click={() => handleModifyAdmin(row)}
						>
							Modify
						</button>
					</td>
				</tr>
			{/each}
		</table>
	</div>
</div>
