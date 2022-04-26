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
	import RoleFilter from '$lib/components/management/RoleFilter.svelte';
	import Filter from '$lib/components/management/Filter.svelte';
	import LoadedContent from '$lib/components/LoadedContent.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import dayjs from 'dayjs';
	import UserManage from '$icons/user-manage.svelte';
	import Filters from '$icons/filters.svelte';
	import { tick } from 'svelte';

	export let mode: 'USER' | 'COLLECTION' = 'USER';
	let users: UserData[] = [];
	let collections = [];
	let loaded = false;

	let tableData: TableCol[] = [];

	let createUserTable = async () => {
		await getUsers()
			.then((res) => (users = res))
			.catch((err) => console.log(err));
		if (users.length === 0) return false;
		tableData = [
			{
				gridSize: '3fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Name', sortable: true },
				renderComponent: EntryName,
				renderComponentProps: users.map((u) => ({ name: u.username, imageUrl: u.imageUrl, address: u.address }))
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
				titleRenderComponentProps: { title: 'Role' },
				renderComponent: EntryGenericText,
				renderComponentProps: users.map((u) => ({ text: 'Need roles' }))
				//renderComponentProps: users.map((u) => {
				//console.log(u);
				//return { role: u.roles.length > 0 ? u.roles[0] : 'User', color: 'text-color-green' };
				//})
			},
			{
				gridSize: '2fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Date Joined', sortable: true },
				renderComponent: EntryGenericText,
				renderComponentProps: users.map((u) => {
					let date = dayjs(u.createdAt);
					return { text: date.format('MMM D, YYYY') };
				})
			},
			{
				gridSize: '2fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Report', centered: true },
				renderComponent: EntryReport,
				renderComponentProps: Array(users.length).map((_) => ({ active: false }))
			}
		];
		console.log(users);
		return true;
	};

	let createCollectionTable = async () => {
		return true;
	};

	let createTable = async () => {
		if (mode === 'USER' && (await createUserTable())) {
			await tick();
			loaded = true;
		} else if (await createCollectionTable()) {
			await tick();
			loaded = true;
		}
	};

	$: if ($currentUserAddress && mode) {
		createTable();
	}

	$: if (users)
		tableData = [
			{
				gridSize: '3fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Name', sortable: true },
				renderComponent: EntryName,
				renderComponentProps: users.map((u) => ({ name: u.username, imageUrl: u.imageUrl, address: u.address }))
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
				titleRenderComponentProps: { title: 'Role' },
				renderComponent: EntryGenericText,
				renderComponentProps: users.map((u) => ({ text: 'Need roles' }))
				//renderComponentProps: users.map((u) => {
				//console.log(u);
				//return { role: u.roles.length > 0 ? u.roles[0] : 'User', color: 'text-color-green' };
				//})
			},
			{
				gridSize: '2fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Date Joined', sortable: true },
				renderComponent: EntryGenericText,
				renderComponentProps: users.map((u) => {
					let date = dayjs(u.createdAt);
					return { text: date.format('MMM D, YYYY') };
				})
			},
			{
				gridSize: '2fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Report', centered: true },
				renderComponent: EntryReport,
				renderComponentProps: Array(users.length).map((_) => ({ active: false }))
			}
		];

	let roleFilterOptions = [
		{ label: 'All', cb: (e) => true },
		{ label: 'Super Admin', cb: (e) => e.roles === 'superadmin' },
		{ label: 'Admin', cb: (e) => e.roles === 'admin' },
		{ label: 'Verified Creator', cb: (e) => e.status === 'VERIFIED' },
		{ label: 'Blogger' },
		{ label: 'Inactive' }
	];
	let filterOptions = [
		{ label: 'Flagged' },
		{ label: 'Joined 24 hrs ago', cb: (e) => dayjs().subtract(1, 'day').isBefore(e.createdAt) },
		{ label: 'Joined 7 days ago', cb: (e) => dayjs().subtract(1, 'week').isBefore(e.createdAt) },
		{ label: 'Joined 1 Mon ago', cb: (e) => dayjs().subtract(1, 'month').isBefore(e.createdAt) }
	];

	$: searchPlaceholder = `Search for ${mode.toLowerCase()}`;
</script>

<LoadedContent {loaded}>
	<div class="flex flex-col w-full h-full p-40 gap-12 ">
		<div class="flex gap-14">
			<div class="{mode === 'USER' ? 'gradient-text gradient-underline' : 'text-color-gray-base'} font-bold text-3xl relative btn" on:click={() => (mode = 'USER')}>User Management</div>
			<div class="{mode === 'COLLECTION' ? 'gradient-text gradient-underline' : 'text-color-gray-dark'} font-bold text-3xl relative btn" on:click={() => (mode = 'COLLECTION')}>
				Collection Management
			</div>
		</div>
		<div class="flex gap-4">
			<SearchBar placeholder={searchPlaceholder} />
			<div class="flex-grow" />
			<div class="flex gap-10">
				{#if mode === 'USER'}
					<div class="">
						<Filter options={roleFilterOptions} icon={UserManage} bind:entries={users} />
					</div>
					<div class="">
						<Filter options={filterOptions} icon={Filters} bind:entries={users} defaultOption={{ label: 'Filter' }} />
					</div>
				{:else}
					<Filter options={roleFilterOptions} icon={UserManage} bind:entries={collections} />
					<Filter options={filterOptions} icon={Filters} bind:entries={collections} />
				{/if}
			</div>
		</div>

		<InteractiveTable {tableData} rows={mode === 'USER' ? users.length : collections.length} />
	</div>
</LoadedContent>

<style lang="postcss">
	.gradient-underline::after {
		content: '';
		@apply absolute w-full -bottom-1 left-0 h-[2px];
		@apply bg-gradient-to-r from-color-purple to-color-blue;
	}
</style>
