<script lang="ts">
	import EntryName from '$lib/components/management/render-components/EntryName.svelte';
	import EthAddress from '$lib/components/management/render-components/EntryEthAddress.svelte';
	import InteractiveTable from '$lib/components/management/InteractiveTable.svelte';
	import TableTitle from '$lib/components/management/render-components/TableTitle.svelte';
	import type { TableCol } from 'src/interfaces/management/tableColumn';
	import SearchBar from '$lib/components/management/SearchBar.svelte';
	import { getUsers } from '$utils/api/management/getUsers';
	import type { UserData } from 'src/interfaces/userData';
	import EntryReport from '$lib/components/management/render-components/EntryReport.svelte';
	import EntryGenericText from '$lib/components/management/render-components/EntryGenericText.svelte';

	export let mode: 'USER' | 'COLLECTION' = 'USER';
	let users: UserData[];
	let collections;

	let tableData: TableCol[];

	let createUserTable = async () => {
		await getUsers()
			.then((res) => (users = res))
			.catch((err) => console.log(err));
		if (!users) return;
		tableData = [
			{
				gridSize: '3fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Name', sortable: true },
				renderComponent: EntryName,
				renderComponentProps: users.map((u) => ({ name: u.username, imageUrl: u.imageUrl }))
			},
			{
				gridSize: '3fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Ethereum Address' },
				renderComponent: EthAddress,
				renderComponentProps: users.map((u) => ({ address: u.address }))
			},
			{
				gridSize: '2fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Ethereum Address' },
				renderComponent: EthAddress,
				renderComponentProps: users.map((u) => ({ address: u.address }))
			},
			{
				gridSize: '2fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Ethereum Address' },
				renderComponent: EntryGenericText,
				renderComponentProps: users.map((u) => ({ text: u.createdAt }))
			},
			{
				gridSize: '2fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Report' },
				renderComponent: EntryReport
			}
		];
	};

	$: {
		mode;
		if (mode === 'USER') {
			createUserTable();
		} else {
			//createCollectionTable()
		}
	}

	$: searchPlaceholder = `Search 1 ${mode.toLowerCase()}`;
</script>

<div class="flex flex-col w-full h-full p-40 gap-12">
	<div class="flex gap-14">
		<div class="{mode === 'USER' ? 'gradient-text gradient-underline' : 'text-color-gray-base'} font-bold text-3xl relative btn" on:click={() => (mode = 'USER')}>User Management</div>
		<div class="{mode === 'COLLECTION' ? 'gradient-text gradient-underline' : 'text-color-gray-dark'} font-bold text-3xl relative btn" on:click={() => (mode = 'COLLECTION')}>
			Collection Management
		</div>
	</div>
	<div class="flex gap-4">
		<SearchBar placeholder={searchPlaceholder} />
	</div>
	<InteractiveTable {tableData} />
</div>

<style lang="postcss">
	.gradient-underline::after {
		content: '';
		@apply absolute w-full -bottom-1 left-0 h-[2px];
		@apply bg-gradient-to-r from-color-purple to-color-blue;
	}
</style>
