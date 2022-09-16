<script lang="ts">
	import EntryName from '$lib/components/management/render-components/EntryName.svelte';
	import EthAddress from '$lib/components/management/render-components/EntryEthAddress.svelte';
	import InteractiveTable from '$lib/components/management/InteractiveTable.svelte';
	import TableTitle from '$lib/components/management/render-components/TableTitle.svelte';
	import type { TableCol } from 'src/interfaces/management/tableColumn';
	import SearchBar from '$lib/components/management/SearchBar.svelte';
	import { getUsers } from '$utils/api/management/getUsers';
	import type { UserData } from 'src/interfaces/userData';
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
	import { getHighestRole } from '$utils/api/management/getHighestRole';
	import FormErrorList from '$lib/components/FormErrorList.svelte';
	import { writable } from 'svelte/store';
	import isCollectionAddress from '$utils/validator/isCollectionAddress';
	import Loader from '$icons/loader.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	let tab: 'USER' | 'COLLECTION' = 'USER';

	let users: UserData[] = [];
	let collections: Collection[] = [];
	let loaded = false;
	let eventId;

	$: if (tab && browser) {
		$page.url.searchParams.set('tab', tab);
		goto('?' + $page.url.searchParams, { keepfocus: true });
	}

	$: if ($page.url.searchParams.has('tab')) {
		// @ts-ignore
		tab = $page.url.searchParams.get('tab');
	}

	const whitelistingCollectionAddress = writable<string>('');
	const whitelistingCollectionSlug = writable<string>('');

	type CollectionErrors = {
		isErc1155OrErc721: boolean;
		isContract: boolean;
		slug: boolean | string;
	};

	const formValidity = writable<Partial<{ [K in keyof CollectionErrors]: any }>>({});

	$: validating = false;
	$: formValid = Object.values($formValidity).every((v) => v === true);

	whitelistingCollectionAddress.subscribe(validateContractAddress);

	async function validateContractAddress(address: string) {
		if (address) {
			validating = true;
			const validation_result = await isCollectionAddress(address);

			console.log(validation_result);

			$formValidity.isContract = validation_result.isContract ? true : 'Invalid Contract Address Detected';
			$formValidity.isErc1155OrErc721 = validation_result.isErc1155 || validation_result.isErc721 ? true : 'Please Add a Contract That Supports ERC721 or ERC1155 NFTs';
			validating = false;
		} else {
			$formValidity.isContract = true;
			$formValidity.isErc1155OrErc721 = true;
		}
	}

	$formValidity.slug = true;

	whitelistingCollectionSlug.subscribe((val) => {
		$formValidity.slug = val ? true : false;
		if (!$formValidity.slug) $formValidity.slug = 'Opensea route is missing';
	});

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
			isClaimed: boolean;
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
		query: '',
	};

	let collectionFetchingOptions: CollectionFetchingOptions = {
		filter: {},
		sort: {},
		name: '',
	};

	let userTableData: TableCol[] = [];
	let collectionTableData: TableCol[] = [];

	const handleTableEvent = async (event: CustomEvent) => {
		if (tab === 'USER') {
			userFetchingOptions.sort = {
				sortBy: event.detail.sortBy,
				sortReversed: event.detail.sortReversed,
			};
			users = await getUsers(getUsersFetchingOptions());
		} else {
			collectionFetchingOptions.sort = {
				sortBy: event.detail.sortBy,
				sortReversed: event.detail.sortReversed,
			};
			collections = (await apiSearchCollections(getCollectionsFetchingOptions())).filter((c) => c.slug);
		}

		eventId = event.detail.id;
	};

	const handleFilter = async (event: CustomEvent) => {
		if (tab === 'USER') {
			userFetchingOptions.filter = {
				createdBefore: event.detail.createdBefore ? event.detail.createdBefore * 1000 : userFetchingOptions.filter.createdBefore,
				role: event.detail.role ? event.detail.role : userFetchingOptions.filter.role,
				status: event.detail.status ? event.detail.status : userFetchingOptions.filter.status,
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
				status: event.detail.status ? event.detail.status : collectionFetchingOptions.filter.status,
				isClaimed: typeof event.detail.value === 'boolean' ? event.detail.value : collectionFetchingOptions.filter.isClaimed,
			};
			console.log(event);
			if (event.detail.status === 'all') collectionFetchingOptions.filter.status = undefined;
			if (event.detail.value === 'all') collectionFetchingOptions.filter.isClaimed = undefined;

			collections = (await apiSearchCollections(getCollectionsFetchingOptions())).filter((c) => c.slug);
		}
	};

	let whitelisting = false;

	const handleVerify = async () => {
		whitelisting = true;

		await whitelistCollection($whitelistingCollectionAddress, $whitelistingCollectionSlug).catch((e) => console.log(e));

		whitelisting = false;
	};

	let roleFilterOptions = [
		{ label: 'All', role: 'all' },
		{ label: 'Super Admin', role: 'superadmin' },
		{ label: 'Admin', role: 'admin' },
		{ label: 'Verified Creator', role: 'verified_user' },
		{ label: 'Blogger' },
		{ label: 'Inactive', status: 'INACTIVATED' },
	];

	let userFilterOptions = [
		{ label: 'Flagged' },
		{ label: 'Joined 24 hrs ago', createdBefore: dayjs().subtract(1, 'hour').unix() },
		{ label: 'Joined 7 days ago', createdBefore: dayjs().subtract(1, 'week').unix() },
		{ label: 'Joined 1 Mon ago', createdBefore: dayjs().subtract(1, 'month').unix() },
	];

	let statusFilterOptions = [
		{ label: 'All', status: 'all' },
		{ label: 'Active', status: 'ACTIVE' },
		{ label: 'Inactive', status: 'INACTIVE' },
	];

	let collectionFilterOptions = [
		{ label: 'Claimed', value: true },
		{ label: 'Unclaimed', value: false },
	];

	$: if ($currentUserAddress && tab) createTable();

	let createTable = async () => {
		loaded = false;
		tab === 'USER' ? await createUserTable() : await createCollectionTable();
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
		return { ...collectionFetchingOptions.filter, name: collectionFetchingOptions.name, ...collectionFetchingOptions.sort };
	};

	const createCollectionTableData = async () => {
		collectionTableData = [
			{
				gridSize: '3fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Name', sortBy: 'ALPHABETICAL', active: false },
				renderComponent: CollectionName,
				renderComponentProps: collections.map((c) => ({ name: c.name || '', imageUrl: c.logoImageUrl, slug: c.slug, badge: c.mintedFrom === 'Hinata' })),
			},
			{
				gridSize: '2fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Ethereum Address' },
				renderComponent: EthAddress,
				renderComponentProps: collections.map((c) => ({ address: c.collectionAddress || 'N/A' })),
			},
			{
				gridSize: '1fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Status' },
				renderComponent: EntryRole,
				renderComponentProps: collections.map((u) => ({
					id: u.slug,
					mode: tab,
					disableAllOnSelect: true,
					role: u.status,
					color: getRoleColor(u.status === 'INACTIVE' ? 'INACTIVATED' : 'verified_user'),
					options: [
						{ label: 'Active', checked: u.status === 'ACTIVE', value: 'ACTIVE' },
						{ label: 'Inactive', checked: u.status === 'INACTIVE', value: 'INACTIVE' },
					],
				})),
			},
			{
				gridSize: '1fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Claimed' },
				renderComponent: EntryGenericText,
				renderComponentProps: collections.map((c) => ({
					text: c.isClaimed ? 'Claimed' : 'Unclaimed',
				})),
			},
			{
				name: 'collection-owner',
				gridSize: '3fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Added by' },
				renderComponent: EntryName,
				renderComponentProps: [],
			},
			{
				gridSize: '2fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Date Joined', sortBy: 'CREATED_AT', active: false },
				renderComponent: EntryGenericText,
				renderComponentProps: collections.map((c) => {
					let date = dayjs(c.createdAt);
					return { text: date.format('MMM D, YYYY') };
				}),
			},
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
					address: creator?.address,
				};
			}),
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

	const debouncedSearch = debounce(async () => (tab === 'USER' ? await getSearchedUsers() : await getSearchedCollections()), 300);

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
				renderComponentProps: users.map((u) => ({ name: u.username || '', imageUrl: u.thumbnailUrl, address: u.address })),
			},
			{
				gridSize: '3fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Ethereum Address' },
				renderComponent: EthAddress,
				renderComponentProps: users.map((u) => ({ address: u.address })),
			},
			{
				gridSize: '2fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Role' },
				renderComponent: EntryRole,
				renderComponentProps: users.map((u) => ({
					id: u.address,
					dispatchAllOptions: true,
					mode: tab,
					role: getHighestRole([...u.roles, u.status]),
					color: getRoleColor(getHighestRole([...u.roles, u.status])),
					options: [
						{ label: 'admin', checked: u.roles?.includes('admin'), cb: (e) => e.roles?.includes('admin'), value: 'admin' },
						{ label: 'verified', checked: u.roles?.includes('verified_user'), cb: (e) => e.roles?.includes('verified_user'), value: 'verified_user' },
						{ label: 'blogger', checked: false, cb: (e) => e.roles?.includes('blogger'), value: 'blogger' },
						{ label: 'inactive', checked: u.status === 'INACTIVATED', cb: (e) => e.status === 'INACTIVATED', value: 'inactivated_user' },
					],
				})),
			},
			{
				gridSize: '2fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Date Joined', sortBy: 'CREATED_AT', active: false },
				renderComponent: EntryGenericText,
				renderComponentProps: users.map((u) => {
					let date = dayjs(u.createdAt);
					return { text: date.format('MMM D, YYYY') };
				}),
			},
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

	$: searchPlaceholder = `Search for ${tab.toLowerCase()}`;

	// Network picker
	// const networkPickerOptions = [
	// 	{ value: 1, label: 'Mainnet' },
	// 	{ value: 4, label: 'Rinkeby' },
	// ];

	// const selectedNetworkOption = writable(networkPickerOptions[0]);

	// selectedNetworkOption.subscribe(() => validateContractAddress($whitelistingCollectionAddress));
</script>

<div class="flex flex-col w-full h-full gap-12 p-40">
	<div class="flex gap-14">
		<div class="{tab === 'USER' ? 'gradient-text gradient-underline' : 'text-color-gray-base'} font-bold text-3xl relative btn" on:click={() => (tab = 'USER')}>User Management</div>
		<div class="{tab === 'COLLECTION' ? 'gradient-text gradient-underline' : 'text-color-gray-dark'} font-bold text-3xl relative btn" on:click={() => (tab = 'COLLECTION')}>Collection Management</div>
	</div>
	<div class="flex gap-4">
		{#if tab === 'USER'}
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
					<Filter on:filter={handleFilter} options={collectionFilterOptions} icon={Filters} defaultOption={{ label: 'Filter', value: 'all' }} />
				</div>
			</div>
		{/if}
	</div>

	{#if tab === 'USER'}
		<LoadedContent {loaded}>
			<InteractiveTable on:event={handleTableEvent} tableData={userTableData} rows={users.length} />
		</LoadedContent>
	{:else}
		<LoadedContent {loaded}>
			<InteractiveTable on:event={handleTableEvent} tableData={collectionTableData} rows={collections.length} />
		</LoadedContent>
	{/if}

	{#if tab === 'COLLECTION'}
		<div>
			<h2 class="text-xl font-bold gradient-text">Whitelist a collection</h2>
			<div class="flex flex-col w-full gap-10 mt-1">
				<!-- Network picker -->
				<!-- <div class="flex flex-col gap-1 w-[36rem]">
					<div class="font-semibold">Network to check address against</div>
					<Dropdown options={networkPickerOptions} bind:selected={$selectedNetworkOption} />
				</div> -->

				<div class="flex flex-col gap-1">
					<div class="font-semibold">Opensea collection URL part</div>
					<div class="flex gap-10">
						<input type="text" class="input max-w-xl w-[36rem]" placeholder="Please input opensea route, e.g. azuki" bind:value={$whitelistingCollectionSlug} />

						<div class="flex-grow" />
					</div>
				</div>
				<div class="flex flex-col gap-1">
					<div class="font-semibold">Contract address</div>
					<div class="flex gap-10">
						<input type="text" class="input max-w-xl w-[36rem]" placeholder="Please input contract address" bind:value={$whitelistingCollectionAddress} />

						<button class="w-40 px-10 py-2 text-lg font-semibold btn btn-gradient btn-rounded" disabled={!$whitelistingCollectionAddress || validating || !formValid} on:click={handleVerify}>
							Whitelist
						</button>
					</div>
				</div>

				{#if validating}
					<div class="flex items-center">
						<Loader class="w-6 mx-2" />
						<div class="font-semibold">Validating...</div>
					</div>
				{/if}

				{#if whitelisting}
					<div class="flex items-center">
						<Loader class="w-6 mx-2" />
						<div class="font-semibold">Whitelisting...</div>
					</div>
				{/if}

				{#if !validating}
					<FormErrorList validity={$formValidity} />
				{/if}
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