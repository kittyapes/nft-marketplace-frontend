<script lang="ts">
	import PersonIcon from '$icons/person.svelte';
	import ChangeCreatorStatusPopup from '$lib/components/admin/ChangeCreatorStatusPopup.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import EthAddress from '$lib/components/EthAddress.svelte';
	import TextInput from '$lib/components/TextInput.svelte';

	let promotePopupOpen = false;
	let inactivatePopupOpen = false;

	// TODO Remove this
	let usernames = ['Username', 'KindaLongerUsername', 'Shrt'];
	let boolStates = [true, false];

	const QUEUE_ROWS = Array(10)
		.fill(0)
		.map((_) => ({
			username: usernames[Math.floor(Math.random() * usernames.length)],
			address: '0x3468C6dE9662C2877vd10184B4228e5711b89D42',
			date: '12-01-21 02:21:34',
			active: boolStates[Math.floor(Math.random() * boolStates.length)]
		}));

	const sortByOptions = [{ label: 'Date' }, { label: 'Alphabetical' }];
</script>

<div class="mt-32">
	{#if promotePopupOpen}
		<ChangeCreatorStatusPopup variant="promote" on:close={() => (promotePopupOpen = false)} />
	{/if}

	{#if inactivatePopupOpen}
		<ChangeCreatorStatusPopup variant="inactivate" on:close={() => (inactivatePopupOpen = false)} />
	{/if}

	<div class="uppercase text-lg font-bold">Verified Creators</div>

	<div class="mt-7 flex items-center">
		<TextInput grayOutline class="w-96 h-14 bg-[#F7F7F7]" />

		<button class="btn btn-rounded btn-outline ml-6 h-12">Search</button>
	</div>

	<div class="w-full flex mt-7 justify-between">
		<div class="flex gap-4">
			<button class="btn btn-rounded uppercase italic btn-outline h-12 w-48 opacity-50">
				Active
			</button>
			<button class="btn btn-rounded uppercase italic btn-outline h-12 w-48 opacity-50">
				Inactive
			</button>
			<button class="btn btn-rounded uppercase italic btn-gradient h-12 w-32">All</button>
		</div>

		<!-- Sort by dropdown -->
		<div class="flex items-center">
			<span class="pr-4 whitespace-nowrap">Sort By</span>
			<div>
				<Dropdown options={sortByOptions} class="w-40" />
			</div>
		</div>
	</div>

	<div class="max-h-[900px] overflow-auto mt-5 custom-scrollbar pb-4">
		<table class="w-full table table-auto border-t border-color-black border-opacity-30">
			{#each QUEUE_ROWS as row}
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
									class="btn btn-rounded uppercase italic btn-gradient h-12 w-48 font-light"
									on:click={() => (inactivatePopupOpen = true)}
								>
									Inactivate
								</button>
								<button
									class="btn uppercase italic gradient-text ml-2 px-2"
									on:click={() => (promotePopupOpen = true)}
								>
									Promote
								</button>
							{:else}
								<button
									class="btn btn-rounded uppercase italic btn-outline h-12 w-48 font-light opacity-50"
								>
									Inactive
								</button>
								<button class="btn uppercase italic gradient-text ml-2 px-2">Reactivate</button>
							{/if}
						</div>
					</td>

					<td class="px-4 w-28 whitespace-nowrap">{row.date}</td>
				</tr>
			{/each}
		</table>
	</div>
</div>
