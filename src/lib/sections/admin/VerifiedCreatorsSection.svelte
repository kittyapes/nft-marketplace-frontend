<script lang="ts">
	import { onEnterKey } from '$actions/onEnterkey';
	import { goto } from '$app/navigation';
	import Loader from '$icons/loader.svelte';
	import PersonIcon from '$icons/person.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import EthAddress from '$lib/components/EthAddress.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { getVerifiedCreators } from '$utils/api/admin/userManagement';
	import { formatDatetimeFromISO } from '$utils/misc/formatDatetime';
	import { makeErrorHandler } from '$utils/toast';
	import { writable } from 'svelte/store';

	const sortByOptions = [
		{ label: 'Date', value: 'UPDATED_AT' },
		{ label: 'Alphabetical', value: 'ALPHABETICAL' },
	];
	const filterByOptions = [
		{ label: 'active', value: 'VERIFIED' },
		{ label: 'Inactive', value: 'INACTIVATED' },
		{ label: 'All', value: 'VERIFIED,INACTIVATED' },
	] as any;

	const filterBy = writable<string>('VERIFIED,INACTIVATED');
	const sortBy = writable<{ label: string; value: any }>(sortByOptions[0]);

	let rows = [];

	// function openPromotePopup() {
	// 	setPopup(ChangeCreatorStatusPopup, { props: { variant: 'promote' } });
	// }

	// function openInactivatePopup() {
	// 	setPopup(ChangeCreatorStatusPopup, { props: { variant: 'inactivate' } });
	// }

	let isFetchingCreators = false;

	async function fetchCreators() {
		if (!$currentUserAddress) return;

		isFetchingCreators = true;

		await getVerifiedCreators($filterBy, $sortBy.value, query)
			.then((res) => {
				rows = res.data.data;
			})
			.catch(makeErrorHandler('Failed to load list of verified creators.'));

		isFetchingCreators = false;
	}

	$: $currentUserAddress && fetchCreators();

	// Search
	let query = '';

	function clickSearch() {
		fetchCreators();
	}
</script>

<div class="mt-32">
	<div class="text-lg font-bold uppercase">Verified Creators</div>

	<div class="flex items-center mt-7">
		<input class="input w-96 h-14" placeholder="Enter username..." bind:value={query} use:onEnterKey={clickSearch} />

		<button class="h-12 ml-6 btn btn-rounded btn-outline" on:click={clickSearch}>Search</button>
	</div>

	<div class="flex justify-between w-full mt-7">
		<!-- Filtering options -->
		<div class="flex gap-4">
			{#each filterByOptions as option}
				<button
					class={$filterBy === option.value ? 'btn-primary' : 'btn-secondary'}
					disabled={isFetchingCreators}
					on:click={() => {
						($filterBy = option.value), fetchCreators();
					}}
				>
					{option.label}
				</button>
			{/each}

			<div class="grid place-items-center opacity-50">Results: {rows.length}</div>
		</div>

		<!-- Sort by dropdown -->
		<div class="flex items-center">
			<span class="pr-4 whitespace-nowrap">Sort By</span>
			<div>
				<Dropdown options={sortByOptions} class="w-40" bind:selected={$sortBy} disabled={isFetchingCreators} on:select={fetchCreators} />
			</div>
		</div>
	</div>

	<div class="max-h-[900px] overflow-auto mt-5 custom-scrollbar pb-4">
		{#if isFetchingCreators}
			<Loader class="ml-0" />
		{/if}

		<table class="table w-full border-t table-auto border-color-black border-opacity-30">
			{#each rows as row}
				<tr class="h-20 border-b border-color-black border-opacity-30">
					<td class="px-4">
						<div class="flex items-center gap-4">
							<PersonIcon />
							{row.username}
						</div>
					</td>

					<td class="px-4 w-72 font-mono">
						<EthAddress address={row.address} />
					</td>

					<td class="whitespace-nowrap">
						Status: <span class="font-semibold uppercase text-gradient">{row.status}</span>
					</td>

					<td class="px-6">
						<button class="btn-secondary" on:click={() => goto('/profile/' + row.address)}>Profile</button>
						<!-- <div class="flex items-center gap-3">
							{#if row.active}
								<button
									class="w-48 h-12 italic font-light uppercase btn btn-rounded btn-gradient"
									on:click={openInactivatePopup}
								>
									Inactivate
								</button>
								<button
									class="px-2 ml-2 italic uppercase btn text-gradient w-28"
									on:click={openPromotePopup}
								>
									Promote
								</button>
							{:else}
								<button
									class="w-48 h-12 italic font-light uppercase opacity-50 btn btn-rounded btn-outline"
								>
									Inactive
								</button>
								<button class="px-2 ml-2 italic uppercase btn text-gradient w-28">
									Reactivate
								</button>
							{/if}
						</div> -->
					</td>

					<td class="px-4 w-28 whitespace-nowrap">{formatDatetimeFromISO(row.updatedAt)}</td>
				</tr>
			{/each}
		</table>
	</div>
</div>
