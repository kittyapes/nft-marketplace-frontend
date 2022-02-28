<script lang="ts">
	import PersonIcon from '$icons/person.svelte';
	import ChangeCreatorStatusPopup from '$lib/components/admin/ChangeCreatorStatusPopup.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import EthAddress from '$lib/components/EthAddress.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { getVerifiedCreators } from '$utils/api/admin/userManagement';
	import { fetchCreatedNfts } from '$utils/api/fetchCreatedNfts';
	import { setPopup } from '$utils/popup';
	import { makeErrorHandler } from '$utils/toast';
	import { filter } from 'lodash-es';
	import { onMount } from 'svelte';
	import { derived, writable } from 'svelte/store';

	const sortByOptions = [
		{ label: 'Date', value: 'date' },
		{ label: 'Alphabetical', value: 'alphabetical' }
	];
	const filterByOptions = [
		{ label: 'active', value: 'verified' },
		{ label: 'Inactive', value: 'inactivated' },
		{ label: 'All', value: 'all' }
	] as any;

	let promotePopupOpen = false;
	let inactivatePopupOpen = false;

	const filterBy = writable<'verified' | 'inactivated' | 'all'>('all');
	const sortBy = writable<{ label: string; value: any }>(sortByOptions[0]);

	let rows = [];

	function openPromotePopup() {
		setPopup(ChangeCreatorStatusPopup, { props: { variant: 'promote' } });
	}

	function openInactivatePopup() {
		setPopup(ChangeCreatorStatusPopup, { props: { variant: 'inactivate' } });
	}

	let isFetchingCreators = false;

	async function fetchCreators() {
		isFetchingCreators = true;

		await getVerifiedCreators($filterBy, $sortBy.value)
			.then((res) => {
				rows = res.data.data;
			})
			.catch(makeErrorHandler('Failed to load list of verified creators.'));

		isFetchingCreators = false;
	}

	$: $filterBy && $sortBy && fetchCreators();
</script>

<div class="mt-32">
	<div class="text-lg font-bold uppercase">Verified Creators</div>

	<div class="flex items-center mt-7">
		<input class="input w-96 h-14" placeholder="Enter username..." />

		<button class="h-12 ml-6 btn btn-rounded btn-outline">Search</button>
	</div>

	<div class="flex justify-between w-full mt-7">
		<!-- Filtering options -->
		<div class="flex gap-4">
			{#each filterByOptions as option}
				<button
					class={$filterBy === option.value ? 'btn-primary' : 'btn-secondary'}
					disabled={isFetchingCreators}
					on:click={() => ($filterBy = option.value)}
				>
					{option.label}
				</button>
			{/each}
		</div>

		<!-- Sort by dropdown -->
		<div class="flex items-center">
			<span class="pr-4 whitespace-nowrap">Sort By</span>
			<div>
				<Dropdown
					options={sortByOptions}
					class="w-40"
					bind:selected={$sortBy}
					disabled={isFetchingCreators}
				/>
			</div>
		</div>
	</div>

	<div class="max-h-[900px] overflow-auto mt-5 custom-scrollbar pb-4">
		<table class="table w-full border-t table-auto border-color-black border-opacity-30">
			{#each rows as row}
				<tr class="h-20 border-b border-color-black border-opacity-30">
					<td class="px-4">
						<div class="flex items-center gap-4">
							<PersonIcon />
							{row.username}
						</div>
					</td>

					<td class="px-4 w-72">
						<EthAddress address={row.address} />
					</td>

					<td class="px-6">
						<div class="flex items-center gap-3">
							{#if row.active}
								<button
									class="w-48 h-12 italic font-light uppercase btn btn-rounded btn-gradient"
									on:click={openInactivatePopup}
								>
									Inactivate
								</button>
								<button
									class="px-2 ml-2 italic uppercase btn gradient-text w-28"
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
								<button class="px-2 ml-2 italic uppercase btn gradient-text w-28">
									Reactivate
								</button>
							{/if}
						</div>
					</td>

					<td class="px-4 w-28 whitespace-nowrap">{row.date}</td>
				</tr>
			{/each}
		</table>
	</div>
</div>
