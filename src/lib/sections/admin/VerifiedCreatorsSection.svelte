<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import EthAddress from '$lib/components/EthAddress.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import PersonIcon from '$icons/person.svelte';
	import ChangeCreatorStatusPopup from '$lib/components/admin/ChangeCreatorStatusPopup.svelte';

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
</script>

<div class="mt-32">
	{#if promotePopupOpen}
		<ChangeCreatorStatusPopup variant="promote" on:close={() => (promotePopupOpen = false)} />
	{/if}

	{#if inactivatePopupOpen}
		<ChangeCreatorStatusPopup variant="inactivate" on:close={() => (inactivatePopupOpen = false)} />
	{/if}

	<div class="uppercase text-lg font-bold">Verified Creators</div>

	<div class="mt-7 flex">
		<TextInput grayOutline class="w-96 h-14" />

		<Button variant="rounded-outline" class="!w-32 ml-7 text-xs">Search</Button>
	</div>

	<div class="w-full flex mt-7 justify-between">
		<div class="flex gap-4">
			<Button variant="rounded-outline" class="!w-36 text-xs opacity-40">active</Button>
			<Button variant="rounded-outline" class="!w-36 text-xs opacity-40">inactive</Button>
			<Button class="!w-24 text-xs" rounded gradient>All</Button>
		</div>

		<div>
			<span class="pr-4">Sort By</span>
			<select class="border h-10 rounded-md">
				<option>Date</option>
				<option>Alphabetical</option>
			</select>
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

					<td class="px-4">
						<EthAddress address={row.address} />
					</td>

					<td class="px-6">
						<div class="flex items-center gap-3">
							{#if row.active}
								<Button
									class="!w-40 text-xs"
									on:click={() => {
										inactivatePopupOpen = true;
									}}
									rounded
									gradient
								>
									Inactivate
								</Button>
								<Button
									class="text-transparent bg-clip-text bg-gradient-to-br from-color-purple to-color-blue font-bold"
									on:click={() => {
										promotePopupOpen = true;
									}}
								>
									PROMOTE
								</Button>
							{:else}
								<Button variant="rounded-outline" class="!w-40 text-xs opacity-50">
									Inactivate
								</Button>
								<Button
									class="text-transparent bg-clip-text bg-gradient-to-br from-color-purple to-color-blue font-bold"
								>
									REACTIVATE
								</Button>
							{/if}
						</div>
					</td>

					<td class="px-4 w-28 whitespace-nowrap">{row.date}</td>
				</tr>
			{/each}
		</table>
	</div>
</div>
