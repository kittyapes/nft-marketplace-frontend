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
	import Filter from '$lib/components/management/Filter.svelte';
	import LoadedContent from '$lib/components/LoadedContent.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import dayjs from 'dayjs';
	import UserManage from '$icons/user-manage.svelte';
	import Filters from '$icons/filters.svelte';
	import { onMount, tick } from 'svelte';
	import EntryRole from '$lib/components/management/render-components/EntryRole.svelte';
	import { isAuthTokenExpired } from '$utils/auth/token';
	import { setPopup } from '$utils/popup';
	import AuthLoginPopup from '$lib/components/auth/AuthLoginPopup/AuthLoginPopup.svelte';
	import { userAuthLoginPopupAdapter } from '$lib/components/auth/AuthLoginPopup/adapters/userAuthLoginPopupAdapter';

	export let mode: 'USER' | 'COLLECTION' = 'USER';
	let users: UserData[] = [];
	let collections = [];
	let loaded = false;

	let tableData: TableCol[] = [];

	let createUserTable = async () => {
		await getUsers()
			.then((res) => (users = res))
			.catch((err) => console.log(err));
		if (!users.length) return false;
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

	let getRoleColor = (role: string) => {
		if (role === 'superadmin') {
			return 'text-color-orange';
		} else if (role === 'admin') {
			return 'gradient-text';
		} else if (role === 'VERIFIED') {
			return 'text-color-green';
		}
	};

	let handleTableEvent = async (event: CustomEvent) => {
		users = await getUsers(event.detail.sortBy, event.detail.sortReversed);
	};

	let handleFilter = (event: CustomEvent) => {
		if (mode === 'USER') users = event.detail.changeTo;
		else collections = event.detail.changeTo;
	};

	$: if ($currentUserAddress && mode) {
		if (isAuthTokenExpired($currentUserAddress)) {
			setPopup(AuthLoginPopup, {
				props: {
					onLoginSuccess: () => {
						createTable();
					},
					adapter: userAuthLoginPopupAdapter
				}
			});
		} else {
			createTable();
		}
	}

	$: if (users)
		tableData = [
			{
				gridSize: '3fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Name', sortBy: 'ALPHABETIC' },
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
				renderComponent: EntryRole,
				renderComponentProps: users.map((u) => ({
					id: u.address,
					role: u.roles[u.roles.length - 1],
					color: getRoleColor(u.roles),
					options: [
						{ label: 'admin', checked: u.roles === 'admin', cb: (e) => e.roles.includes('admin') },
						{ label: 'verified', checked: u.status === 'VERIFIED', cb: (e) => e.status.includes() === 'verified' },
						{ label: 'blogger', checked: false, cb: (e) => e.roles === 'blogger' },
						{ label: 'inactive', checked: false, cb: (e) => e.roles === 'inactive' }
					]
				}))
			},
			{
				gridSize: '2fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Date Joined', sortBy: 'CREATED_AT' },
				renderComponent: EntryGenericText,
				renderComponentProps: users.map((u) => {
					let date = dayjs(u.createdAt);
					return { text: date.format('MMM D, YYYY') };
				})
			}
			/*
			{
				gridSize: '2fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Report', centered: true },
				renderComponent: EntryReport,
				renderComponentProps: Array(users.length).map((_) => ({ active: false }))
			}*/
		];

	let roleFilterOptions = [
		{ label: 'All', cb: () => true },
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
	<div class="flex flex-col w-full h-full p-40 gap-12">
		<div class="flex gap-14">
			<div class="{mode === 'USER' ? 'gradient-text gradient-underline' : 'text-color-gray-base'} font-bold text-3xl relative btn" on:click={() => (mode = 'USER')}>User Management</div>
			<div class="{mode === 'COLLECTION' ? 'gradient-text gradient-underline' : 'text-color-gray-dark'} font-bold text-3xl relative btn" on:click={() => (mode = 'COLLECTION')}>
				Collection Management
			</div>
		</div>
		<div class="flex gap-4">
			{#if mode === 'USER'}
				<SearchBar placeholder={searchPlaceholder} />
				<div class="flex-grow" />
				<div class="flex gap-10">
					<div class="">
						<Filter on:filter={handleFilter} options={roleFilterOptions} icon={UserManage} bind:entries={users} />
					</div>
					<div class="">
						<Filter on:filter={handleFilter} options={filterOptions} icon={Filters} bind:entries={users} defaultOption={{ label: 'Filter', cb: (e) => true }} />
					</div>
				</div>
			{:else}
				<SearchBar placeholder={searchPlaceholder} />
				<div class="flex-grow" />
				<div class="flex gap-10">
					<Filter options={roleFilterOptions} icon={UserManage} bind:entries={collections} />
					<Filter options={filterOptions} icon={Filters} bind:entries={collections} />
				</div>
			{/if}
		</div>

		<InteractiveTable on:event={handleTableEvent} {tableData} rows={mode === 'USER' ? users.length : collections.length} />
	</div>
</LoadedContent>

<style lang="postcss">
	.gradient-underline::after {
		content: '';
		@apply absolute w-full -bottom-1 left-0 h-[2px];
		@apply bg-gradient-to-r from-color-purple to-color-blue;
	}
</style>
