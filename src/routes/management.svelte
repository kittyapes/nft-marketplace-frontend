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
	import EntryRole from '$lib/components/management/render-components/EntryRole.svelte';
	import { debounce } from 'lodash-es';
	import { apiSearchCollections, type Collection } from '$utils/api/collection';
	import CollectionName from '$lib/components/management/render-components/CollectionName.svelte';
	import { fetchProfileData } from '$utils/api/profile';
	import { whitelistCollection } from '$utils/api/management/whitelistCollection';
	import { getRoleColor } from '$utils/api/management/getRoleColor';

	export let mode: 'USER' | 'COLLECTION' = 'USER';
	let users: UserData[] = [];
	let collections: Collection[] = [];
	let loaded = false;
	let eventId;
	let whitelistingCollectionAddress: string;

	interface UserFetchingOptions {
		filter: Partial<{
			createdBefore: number;
			role: string;
			status: string;
		}>;
		sort: Partial<{
			sortBy: 'ALPHABETICAL' | 'CREATED_AT';
			sortReversed: boolean;
		}>;
		query: string;
	}

	interface CollectionFetchingOptions {
		filter: Partial<{
			status: string;
		}>;
		sort: Partial<{
			sortBy: 'ALPHABETICAL' | 'CREATED_AT';
			sortReversed: boolean;
		}>;
		name: string;
	}

	let userFetchingOptions: UserFetchingOptions = {
		filter: {},
		sort: {},
		query: ''
	};

	let collectionFetchingOptions: CollectionFetchingOptions = {
		filter: {},
		sort: {},
		name: ''
	};

	let userTableData: TableCol[] = [];
	let collectionTableData: TableCol[] = [];

	const handleTableEvent = async (event: CustomEvent) => {
		if (mode === 'USER') {
			userFetchingOptions.sort = {
				sortBy: event.detail.sortBy,
				sortReversed: event.detail.sortReversed
			};
			users = await getUsers(getUsersFetchingOptions());
		} else {
			collectionFetchingOptions.sort = {
				sortBy: event.detail.sortBy,
				sortReversed: event.detail.sortReversed
			};
			collections = (await apiSearchCollections(getCollectionsFetchingOptions())).filter((c) => c.slug);
		}

		eventId = event.detail.id;
	};

	const handleFilter = async (event: CustomEvent) => {
		if (mode === 'USER') {
			userFetchingOptions.filter = {
				createdBefore: event.detail.createdBefore ? event.detail.createdBefore * 1000 : userFetchingOptions.filter.createdBefore,
				role: event.detail.role ? event.detail.role : userFetchingOptions.filter.role,
				status: event.detail.status ? event.detail.status : userFetchingOptions.filter.status
			};

			if (event.detail.status) userFetchingOptions.filter.role = undefined;
			else if (event.detail.role) userFetchingOptions.filter.status = undefined;

			if (event.detail.role === 'all') {
				userFetchingOptions.filter.role = undefined;
				userFetchingOptions.filter.status = undefined;
			}

			users = await getUsers(getUsersFetchingOptions());
		} else {
			collectionFetchingOptions.filter = {
				status: event.detail.status ? event.detail.status : collectionFetchingOptions.filter.status
			};

			if (event.detail.status === 'all') collectionFetchingOptions.filter.status = undefined;
			collections = (await apiSearchCollections(getCollectionsFetchingOptions())).filter((c) => c.slug);
		}
	};

	const handleVerify = async () => {
		if (!whitelistingCollectionAddress) return;
		const res = await whitelistCollection(whitelistingCollectionAddress).catch((e) => console.log(e));
	};

	let roleFilterOptions = [
		{ label: 'All', role: 'all' },
		{ label: 'Super Admin', role: 'superadmin' },
		{ label: 'Admin', role: 'admin' },
		{ label: 'Verified Creator', role: 'verified_user' },
		{ label: 'Blogger' },
		{ label: 'Inactive', status: 'INACTIVATED' }
	];

	let userFilterOptions = [
		{ label: 'Flagged' },
		{ label: 'Joined 24 hrs ago', createdBefore: dayjs().subtract(1, 'hour').unix() },
		{ label: 'Joined 7 days ago', createdBefore: dayjs().subtract(1, 'week').unix() },
		{ label: 'Joined 1 Mon ago', createdBefore: dayjs().subtract(1, 'month').unix() }
	];

	let statusFilterOptions = [
		{ label: 'All', status: 'all' },
		{ label: 'Active', status: 'ACTIVE' },
		{ label: 'Inactive', status: 'INACTIVE' }
	];

	let collectionFilterOptions = [{ label: 'Claimed' }, { label: 'Unclaimed' }];

	$: if ($currentUserAddress && mode) createTable();

	let createTable = async () => {
		loaded = false;
		mode === 'USER' ? await createUserTable() : await createCollectionTable();
	};

	//COLLECTION section

	let createCollectionTable = async () => {
		await apiSearchCollections()
			.then((res) => (collections = res.filter((c) => c.slug)))
			.catch((err) => console.log(err));

		if (!collections.length) return;

		await createCollectionTableData();
	};

	let getCollectionsFetchingOptions = () => {
		return { /*...collectionFetchingOptions.filter,*/ name: collectionFetchingOptions.name, ...collectionFetchingOptions.sort };
	};

	const createCollectionTableData = async () => {
		collectionTableData = [
			{
				gridSize: '3fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Name', sortBy: 'ALPHABETICAL', active: false },
				renderComponent: CollectionName,
				renderComponentProps: collections.map((c) => ({ name: c.name || '', imageUrl: c.logoImageUrl, slug: c.slug }))
			},
			/*{
				gridSize: '2fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Ethereum Address' },
				renderComponent: EthAddress,
				renderComponentProps: collections.map((c) => ({ address: c.paymentTokenAddress }))
			},*/
			{
				gridSize: '1fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Status' },
				renderComponent: EntryRole,
				renderComponentProps: collections.map((u) => ({
					id: u.slug,
					mode,
					disableAllOnSelect: true,
					role: u.status,
					color: getRoleColor(u.status === 'INACTIVE' ? 'INACTIVATED' : 'verified_user'),
					options: [
						{ label: 'Active', checked: u.status === 'ACTIVE', value: 'ACTIVE' },
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
					color: 'text-color-red',
					text: 'Unclaimed'
				}))
			},
			{
				name: 'collection-owner',
				gridSize: '3fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Added by' },
				renderComponent: EntryName,
				renderComponentProps: []
			},
			{
				gridSize: '2fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Date Joined', sortBy: 'CREATED_AT', active: false },
				renderComponent: EntryGenericText,
				renderComponentProps: collections.map((c) => {
					let date = dayjs(c.createdAt);
					return { text: date.format('MMM D, YYYY') };
				})
			}
		];

		collectionTableData.forEach(async (e, i) => {
			e.titleRenderComponentProps.id = i;
			if (i === eventId) e.titleRenderComponentProps.active = true;
			if (e.name === 'collection-owner') {
				e.renderComponentProps = Array(collectionTableData[i - 1].renderComponentProps.length);
				e.renderComponentProps = await getCollectionOwners(collections);
				collectionTableData = collectionTableData;
			}
		});
	};

	const getCollectionOwners = async (collections: Collection[]) => {
		return await Promise.all(
			collections.map(async (c) => {
				let creator = await fetchProfileData(c.creator);
				return {
					name: creator?.username || '',
					imageUrl: creator?.thumbnailUrl,
					address: creator?.address
				};
			})
		);
	};

	const updateCollectionTableData = async () => {
		await createCollectionTableData();
		loaded = true;
	};

	$: if (collections) {
		updateCollectionTableData();
	}

	const getSearchedCollections = async () => {
		collections = (await apiSearchCollections(getCollectionsFetchingOptions())).filter((c) => c.slug);
	};

	// USER section

	let createUserTable = async () => {
		await getUsers()
			.then((res) => (users = res))
			.catch((err) => console.log(err));
		if (!users.length) return;
	};

	let getUsersFetchingOptions = () => {
		return { ...userFetchingOptions.filter, query: userFetchingOptions.query, ...userFetchingOptions.sort };
	};

	const debouncedSearch = debounce(async () => (mode === 'USER' ? await getSearchedUsers() : await getSearchedCollections()), 300);

	const getSearchedUsers = async () => {
		users = await getUsers(getUsersFetchingOptions());
	};

	$: if (userFetchingOptions.query || collectionFetchingOptions.name) {
		loaded = false;
		debouncedSearch();
	}

	$: if (users) {
		userTableData = [
			{
				gridSize: '3fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Name', sortBy: 'ALPHABETICAL', active: false },
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
					dispatchAllOptions: true,
					mode,
					role: u.status === 'INACTIVATED' ? u.status : u.roles?.includes('superadmin') ? 'superadmin' : u.roles?.[0],
					color: getRoleColor(u.status === 'INACTIVATED' ? u.status : u.roles?.includes('superadmin') ? 'superadmin' : u.roles?.[0]),
					options: [
						{ label: 'admin', checked: u.roles?.includes('admin'), cb: (e) => e.roles?.includes('admin'), value: 'admin' },
						{ label: 'verified', checked: u.roles?.includes('verified_user'), cb: (e) => e.roles?.includes('verified_user'), value: 'verified_user' },
						{ label: 'blogger', checked: false, cb: (e) => e.roles?.includes('blogger'), value: 'blogger' },
						{ label: 'inactive', checked: u.status === 'INACTIVATED', cb: (e) => e.status === 'INACTIVATED', value: 'inactivated_user' }
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
		loaded = true;
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
					<Filter on:filter={handleFilter} options={userFilterOptions} icon={Filters} defaultOption={{ label: 'Filter' }} />
				</div>
			</div>
		{:else}
			<SearchBar bind:query={collectionFetchingOptions.name} placeholder={searchPlaceholder} />
			<div class="flex-grow" />
			<div class="flex gap-10">
				<div class="">
					<Filter on:filter={handleFilter} options={statusFilterOptions} icon={UserManage} />
				</div>
				<div class="">
					<Filter on:filter={handleFilter} options={collectionFilterOptions} icon={Filters} defaultOption={{ label: 'Filter' }} />
				</div>
			</div>
		{/if}
	</div>

	{#if mode === 'USER'}
		<LoadedContent {loaded}>
			<InteractiveTable on:event={handleTableEvent} tableData={userTableData} rows={users.length} />
		</LoadedContent>
	{:else}
		<LoadedContent {loaded}>
			<InteractiveTable on:event={handleTableEvent} tableData={collectionTableData} rows={collections.length} />
		</LoadedContent>
	{/if}

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
