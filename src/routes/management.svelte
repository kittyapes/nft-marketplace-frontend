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
	import { tick } from 'svelte';
	import EntryRole from '$lib/components/management/render-components/EntryRole.svelte';
	import { debounce } from 'lodash-es';
	import { apiSearchCollections, type Collection } from '$utils/api/collection';
	import CollectionName from '$lib/components/management/render-components/CollectionName.svelte';
	import { fetchProfileData } from '$utils/api/profile';
	import { whitelistCollection } from '$utils/api/management/whitelistCollection';

	export let mode: 'USER' | 'COLLECTION' = 'USER';
	let users: UserData[] = [];
	let collections: Collection[] = [];
	let loaded = false;
	let eventId;
	let whitelistingCollectionAddress: string;

	interface userFetchingOptions {
		filter: Partial<{
			createdBefore: number;
			role: string;
			status: string;
		}>;
		sort: Partial<{
			sortBy: string;
			sortReversed: boolean;
		}>;
		query: string;
	}

	let userFetchingOptions: userFetchingOptions = {
		filter: {},
		sort: {},
		query: ''
	};

	let userTableData: TableCol[] = [];
	let collectionTableData: TableCol[] = [];

	const handleTableEvent = async (event: CustomEvent) => {
		userFetchingOptions.sort = {
			sortBy: event.detail.sortBy,
			sortReversed: event.detail.sortReversed
		};

		users = await getUsers(getUsersFetchingOptions());
		eventId = event.detail.id;
	};

	const handleFilter = async (event: CustomEvent) => {
		if (mode === 'USER') {
			userFetchingOptions.filter = {
				createdBefore: event.detail.createdBefore ? event.detail.createdBefore * 1000 : userFetchingOptions.filter.createdBefore,
				role: event.detail.role ? event.detail.role : userFetchingOptions.filter.role,
				status: event.detail.status ? event.detail.status : userFetchingOptions.filter.status
			};
			users = await getUsers(getUsersFetchingOptions());
		} else {
			collections = event.detail.changeTo;
		}
	};

	const handleVerify = async () => {
		if (!whitelistingCollectionAddress) return;

		const res = await whitelistCollection(whitelistingCollectionAddress).catch((e) => console.log(e));
		console.log(res);
	};

	let roleFilterOptions = [
		{ label: 'All', role: '' },
		{ label: 'Super Admin', role: 'superadmin' },
		{ label: 'Admin', role: 'admin' },
		{ label: 'Verified Creator', role: 'verified_user' },
		{ label: 'Blogger' },
		{ label: 'Inactive', status: 'INACTIVATED' }
	];

	let filterOptions = [
		{ label: 'Flagged' },
		{ label: 'Joined 24 hrs ago', createdBefore: dayjs().subtract(1, 'hour').unix() },
		{ label: 'Joined 7 days ago', createdBefore: dayjs().subtract(1, 'week').unix() },
		{ label: 'Joined 1 Mon ago', createdBefore: dayjs().subtract(1, 'month').unix() }
	];

	let getRoleColor = (role: string) => {
		if (role === 'superadmin') {
			return 'text-color-orange';
		} else if (role === 'admin') {
			return 'gradient-text';
		} else if (role === 'verified_user') {
			return 'text-green-400';
		} else if (role === 'INACTIVATED') {
			return 'text-color-gray-light';
		}
	};

	$: if ($currentUserAddress && mode) createTable();

	let createTable = async () => {
		loaded = false;
		mode === 'USER' ? await createUserTable() : await createCollectionTable();
		await tick();
		loaded = true;
	};

	//COLLECTION section

	let createCollectionTable = async () => {
		await apiSearchCollections(null, null, 10)
			.then((res) => (collections = res))
			.catch((err) => console.log(err));
		if (!collections.length) return false;
		console.log(collections);
		return true;
	};

	let getCollectionsFetchingOptions = () => {
		return {};
	};

	$: if (collections.length) {
		collectionTableData = [
			{
				gridSize: '3fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Name', sortBy: 'ALPHABETIC', active: false },
				renderComponent: CollectionName,
				renderComponentProps: collections.map((c) => ({ name: c.name || '', imageUrl: c.logoImageUrl, slug: c.slug }))
			},
			{
				gridSize: '2fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Ethereum Address' },
				renderComponent: EthAddress,
				renderComponentProps: collections.map((c) => ({ address: c.paymentTokenAddress }))
			},
			{
				gridSize: '1fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Status' },
				renderComponent: EntryRole,
				renderComponentProps: collections.map((u) => ({
					id: u.id,
					role: u.status,
					color: getRoleColor(u.status === 'INACTIVE' ? 'INACTIVATED' : 'verified_user'),
					options: [
						{ label: 'Listed', checked: u.status === 'LISTED', value: 'LISTED' },
						{ label: 'Inactive', checked: u.status === 'INACTIVE', value: 'INACTIVE' }
					]
				}))
			},
			{
				gridSize: '1fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Claimed' },
				renderComponent: EntryGenericText,
				renderComponentProps: collections.map((c) => ({
					text: 'Claimed'
				}))
			},
			{
				gridSize: '3fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Added by' },
				renderComponent: EntryName,
				renderComponentProps: collections.map(async (c) => {
					let creator = await fetchProfileData(c.creator);
					console.log(creator);
					return {
						name: creator?.username || '',
						imageUrl: creator?.thumbnailUrl,
						address: creator?.address
					};
				})
			},
			{
				gridSize: '2fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Date Joined', sortBy: 'CREATED_AT', active: false },
				renderComponent: EntryGenericText,
				renderComponentProps: collections.map((c) => {
					let date = dayjs(c.royalties?.[0]?.createdAt);
					return { text: date.format('MMM D, YYYY') };
				})
			}
		];
		collectionTableData.forEach((e, i) => {
			e.titleRenderComponentProps.id = i;
			if (i === eventId) e.titleRenderComponentProps.active = true;
		});
	}

	// USER section

	let createUserTable = async () => {
		await getUsers()
			.then((res) => (users = res))
			.catch((err) => console.log(err));
		if (!users.length) return false;

		return true;
	};

	let getUsersFetchingOptions = () => {
		return { ...userFetchingOptions.filter, query: userFetchingOptions.query, ...userFetchingOptions.sort };
	};

	const debouncedSearch = debounce(async () => await getSearchedUsers(), 500);

	const getSearchedUsers = async () => {
		users = await getUsers(getUsersFetchingOptions());
	};

	$: if (userFetchingOptions.query) {
		debouncedSearch();
	}

	$: if (users.length) {
		userTableData = [
			{
				gridSize: '3fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Name', sortBy: 'ALPHABETIC', active: false },
				renderComponent: EntryName,
				renderComponentProps: users.map((u) => ({ name: u.username || '', imageUrl: u.thumbnailUrl, address: u.address }))
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
					role: u.status === 'INACTIVATED' ? u.status : u.roles?.includes('superadmin') ? 'superadmin' : u.roles?.[0],
					color: getRoleColor(u.status === 'INACTIVATED' ? u.status : u.roles?.includes('superadmin') ? 'superadmin' : u.roles?.[0]),
					options: [
						{ label: 'admin', checked: u.roles?.includes('admin'), cb: (e) => e.roles?.includes('admin'), value: 'admin' },
						{ label: 'verified', checked: u.roles?.includes('verified_user'), cb: (e) => e.roles?.includes('verified_user'), value: 'verified_user' },
						{ label: 'blogger', checked: false, cb: (e) => e.roles?.includes('blogger'), value: 'blogger' },
						{ label: 'inactive', checked: u.status === 'INACTIVATED', cb: (e) => e.status === 'INACTIVATED', value: 'inactived_user' }
					]
				}))
			},
			{
				gridSize: '2fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Date Joined', sortBy: 'CREATED_AT', active: false },
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
		userTableData.forEach((e, i) => {
			e.titleRenderComponentProps.id = i;
			if (i === eventId) e.titleRenderComponentProps.active = true;
		});
	}

	$: searchPlaceholder = `Search for ${mode.toLowerCase()}`;
</script>

<div class="flex flex-col w-full h-full p-40 gap-12">
	<div class="flex gap-14">
		<div class="{mode === 'USER' ? 'gradient-text gradient-underline' : 'text-color-gray-base'} font-bold text-3xl relative btn" on:click={() => (mode = 'USER')}>User Management</div>
		<div class="{mode === 'COLLECTION' ? 'gradient-text gradient-underline' : 'text-color-gray-dark'} font-bold text-3xl relative btn" on:click={() => (mode = 'COLLECTION')}>
			Collection Management
		</div>
	</div>
	<div class="flex gap-4">
		{#if mode === 'USER'}
			<SearchBar bind:query={userFetchingOptions.query} placeholder={searchPlaceholder} />
			<div class="flex-grow" />
			<div class="flex gap-10">
				<div class="">
					<Filter on:filter={handleFilter} options={roleFilterOptions} icon={UserManage} />
				</div>
				<div class="">
					<Filter on:filter={handleFilter} options={filterOptions} icon={Filters} defaultOption={{ label: 'Filter' }} />
				</div>
			</div>
		{:else}
			<SearchBar bind:query={userFetchingOptions.query} placeholder={searchPlaceholder} />
			<div class="flex-grow" />
			<div class="flex gap-10">
				<Filter options={roleFilterOptions} icon={UserManage} />
				<Filter options={filterOptions} icon={Filters} />
			</div>
		{/if}
	</div>
	<LoadedContent {loaded}>
		<InteractiveTable on:event={handleTableEvent} tableData={mode === 'USER' ? userTableData : collectionTableData} rows={mode === 'USER' ? users.length : collections.length} />
	</LoadedContent>
	{#if mode === 'COLLECTION'}
		<div class="flex flex-col w-full gap-4 ">
			<div class="flex flex-col gap-1">
				<div class="text-color-black ">Verify Collection on Marketplace</div>
				<div class="flex gap-10">
					<input type="text" class="input max-w-xl w-[36rem]" placeholder="Please input contract address" bind:value={whitelistingCollectionAddress} />
					<div class="flex-grow" />
					<button class="btn btn-gradient btn-rounded px-10 py-2 w-40 font-semibold text-lg" on:click={handleVerify}>Verify</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	.gradient-underline::after {
		content: '';
		@apply absolute w-full -bottom-1 left-0 h-[2px];
		@apply bg-gradient-to-r from-color-purple to-color-blue;
	}
</style>
