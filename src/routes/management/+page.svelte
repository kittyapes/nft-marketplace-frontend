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
	import dayjs from 'dayjs';
	import UserManage from '$icons/user-manage.svelte';
	import Filters from '$icons/filters-v2.svelte';
	import EntryRole from '$lib/components/management/render-components/EntryRole.svelte';
	import { debounce } from 'lodash-es';
	import {
		apiSearchCollections,
		type Collection,
		type CollectionSearchOptions,
	} from '$utils/api/collection';
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
	import PaginationFooter from '$lib/components/management/render-components/PaginationFooter.svelte';
	import { onDestroy } from 'svelte';
	import TosManagement from './TosManagement/TosManagement.svelte';
	import { getGradientColors } from '$utils/api/management/getGradientColors';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import NotificationsManagement from './Notifications/NotificationsManagement.svelte';

	const fetchLimit = 20;

	let tab: 'USER' | 'COLLECTION' | 'NOTIFICATIONS' | 'TOS' = 'USER';

	let users: UserData[] = [];
	let totalUserEntries = 0;
	let userPage = 1;
	let usersPerPage = 20;

	let collections: Collection[] = [];
	let totalCollectionEntries = 0;
	let collectionPage = 1;
	let collectionsPerPage = 20;

	let loaded = false;
	let eventId;

	$: if ($page.url.searchParams.has('tab')) {
		// @ts-ignore
		tab = $page.url.searchParams.get('tab');
	}

	onDestroy(() => {
		$page.url.searchParams.delete('tab');
	});

	// for some reason this reactive block runs on other pages when navigated there, so this is a hotfix for that problem
	$: if (browser && tab && $page.url.pathname === '/management') {
		$page.url.searchParams.set('tab', tab);
		goto('?' + $page.url.searchParams, { keepfocus: true });
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

			$formValidity.isContract = validation_result.isContract
				? true
				: 'Invalid Contract Address Detected';
			$formValidity.isErc1155OrErc721 =
				validation_result.isErc1155 || validation_result.isErc721
					? true
					: 'Please Add a Contract That Supports ERC721 or ERC1155 NFTs';
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
			createdAfter: number;
			role: string;
			status: string;
		}>;
		sort: Partial<{
			sortBy: 'ALPHABETICAL' | 'CREATED_AT';
			sortReversed: boolean;
			limit: number;
		}>;
		query: string;
		limit: number;
	}

	interface CollectionFetchingOptions {
		filter: Partial<{
			status: 'ACTIVE' | 'INACTIVE' | 'ALL';
			isClaimed: boolean;
		}>;
		sort: Partial<{
			sortBy:
				| 'ALPHABETICAL'
				| 'CREATED_AT'
				| 'ONE_DAY_VOLUME'
				| 'SEVEN_DAYS_VOLUME'
				| 'THIRTY_DAYS_VOLUME'
				| 'TOTAL_VOLUME';
			sortReversed: boolean;
		}>;
		name: string;
		limit: number;
	}

	let userFetchingOptions: UserFetchingOptions = {
		filter: {},
		limit: usersPerPage,
		sort: {},
		query: '',
	};

	let collectionFetchingOptions: CollectionFetchingOptions = {
		filter: {},
		limit: collectionsPerPage,
		sort: {},
		name: '',
	};

	let userTableData: TableCol[] = [];
	let collectionTableData: TableCol[] = [];

	const handleTableEvent = async (event: CustomEvent) => {
		if (event.detail.id || event.detail.sortBy || event.detail.sortReversed) {
			await handleTableSort(event);
		}

		if (event.detail.page) {
			await handlePageSelect(event);
		}

		if (event.detail.itemsPerPage) {
			await handleItemsPerPageSelect(event);
		}
	};

	const handlePageSelect = async (event: CustomEvent) => {
		if (tab === 'USER') {
			userPage = event.detail.page;
			await getSearchedUsers();
		}

		if (tab === 'COLLECTION') {
			collectionPage = event.detail.page;
			await getSearchedCollections();
		}
	};

	const handleItemsPerPageSelect = async (event: CustomEvent) => {
		if (tab === 'USER') {
			usersPerPage = event.detail.itemsPerPage;
			await getSearchedUsers();
		}

		if (tab === 'COLLECTION') {
			collectionsPerPage = event.detail.itemsPerPage;
			await getSearchedCollections();
		}
	};

	const handleTableSort = async (event: CustomEvent) => {
		if (tab === 'USER') {
			userFetchingOptions.sort = {
				sortBy: event.detail.sortBy,
				sortReversed: event.detail.sortReversed,
			};
			await getSearchedUsers();
		} else {
			collectionFetchingOptions.sort = {
				sortBy: event.detail.sortBy,
				sortReversed: event.detail.sortReversed,
			};
			await getSearchedCollections();
		}

		eventId = event.detail.id;
	};

	// TODO: split into multiple functions
	const handleFilter = async (event: CustomEvent) => {
		if (tab === 'USER') {
			userFetchingOptions.filter = {
				createdAfter: event.detail.createdAfter
					? event.detail.createdAfter * 1000
					: userFetchingOptions.filter.createdAfter,
				role: event.detail.role ? event.detail.role : userFetchingOptions.filter.role,
			};

			if (event.detail.status) userFetchingOptions.filter.role = undefined;
			else if (event.detail.role) userFetchingOptions.filter.status = undefined;

			if (event.detail.role === 'all') {
				userFetchingOptions.filter.role = undefined;
				userFetchingOptions.filter.status = undefined;
			}
			if (event.detail.createdAfter === 'all') userFetchingOptions.filter.createdAfter = undefined;
		} else {
			collectionFetchingOptions.filter = {
				status: event.detail.status ? event.detail.status : collectionFetchingOptions.filter.status,
				isClaimed:
					typeof event.detail.value === 'boolean'
						? event.detail.value
						: collectionFetchingOptions.filter.isClaimed,
			};

			if (event.detail.value === 'all') collectionFetchingOptions.filter.isClaimed = undefined;
		}

		debouncedSearch();
	};

	$: if (userFetchingOptions) {
		userPage = 1;
	}

	$: if (collectionFetchingOptions) {
		collectionPage = 1;
	}

	let whitelisting = false;

	const handleVerify = async () => {
		whitelisting = true;

		whitelistingCollectionSlug.update((str) => {
			if (str.startsWith('http')) {
				return str.substring(str.lastIndexOf('/') + 1);
			}

			return str;
		});

		await whitelistCollection($whitelistingCollectionAddress, $whitelistingCollectionSlug).catch(
			(e) => console.log(e),
		);

		whitelisting = false;
	};

	let roleFilterOptions = [
		{ label: 'All', role: 'all' },
		{ label: 'Super Admin', role: 'superadmin' },
		{ label: 'Admin', role: 'admin' },
		{ label: 'Verified Creator', role: 'verified_user' },
		{ label: 'Blogger' },
		{ label: 'Inactive', role: 'inactivated_user' },
	];

	let userFilterOptions = [
		{ label: 'Flagged' },
		{ label: 'Joined 24 hrs ago', createdAfter: dayjs().subtract(1, 'hour').unix() },
		{ label: 'Joined 7 days ago', createdAfter: dayjs().subtract(1, 'week').unix() },
		{ label: 'Joined 1 Mon ago', createdAfter: dayjs().subtract(1, 'month').unix() },
	];

	let statusFilterOptions = [
		{ label: 'All', status: 'ALL' },
		{ label: 'Active', status: 'ACTIVE' },
		{ label: 'Inactive', status: 'INACTIVE' },
	];

	let collectionFilterOptions = [
		{ label: 'Claimed', value: true },
		{ label: 'Unclaimed', value: false },
	];

	//COLLECTION section

	let getCollectionsFetchingOptions = (): CollectionSearchOptions => {
		return {
			...collectionFetchingOptions.filter,
			name: collectionFetchingOptions.name,
			...collectionFetchingOptions.sort,
			limit: collectionsPerPage,
			page: collectionPage,
			status: collectionFetchingOptions.filter.status,
		};
	};

	const createCollectionTableData = async () => {
		collectionTableData = [
			{
				gridSize: '3fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Name', sortBy: 'ALPHABETICAL', active: false },
				renderComponent: CollectionName,
				renderComponentProps: collections.map((c) => ({
					name: c.name || '',
					imageUrl: c.logoImageUrl,
					slug: c.slug,
					badge: c.mintedFrom === 'Hinata',
				})),
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
				renderComponentProps: collections.map((c) => ({
					id: c.slug,
					mode: tab,
					uncheckAllOnSelect: true,
					role: c.status,
					color: getRoleColor(c.status),
					arrowGradient: getGradientColors(c.status),
					options: [
						{ label: 'Listed', checked: c.status === 'ACTIVE', value: 'ACTIVE', disabled: false },
						{
							label: 'Inactive',
							checked: c.status === 'INACTIVE',
							value: 'INACTIVE',
							disabled: false,
						},
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
					return { text: date.format('DD - MMM - YYYY') };
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
		// @ts-ignore
		await apiSearchCollections(getCollectionsFetchingOptions()).then((res) => {
			collections = res.collections.filter((c) => c.slug);
			totalCollectionEntries = res.totalCount;
		});
	};

	// USER section

	let getUsersFetchingOptions = () => {
		return {
			...userFetchingOptions.filter,
			query: userFetchingOptions.query,
			...userFetchingOptions.sort,
			limit: usersPerPage,
			page: userPage,
		};
	};

	const debouncedSearch = debounce(async () => {
		loaded = false;
		tab === 'USER' ? await getSearchedUsers() : await getSearchedCollections();
	}, 300);

	const getSearchedUsers = async () => {
		const res = await getUsers(getUsersFetchingOptions());
		users = res.users;
		totalUserEntries = res.totalCount;
	};

	$: if (
		browser &&
		tab &&
		(userFetchingOptions.query ||
			userFetchingOptions.query?.length === 0 ||
			collectionFetchingOptions.name ||
			collectionFetchingOptions.name?.length === 0)
	) {
		debouncedSearch();
	}

	$: if (users) {
		userTableData = [
			{
				gridSize: '3fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Name', sortBy: 'ALPHABETICAL', active: false },
				renderComponent: EntryName,
				renderComponentProps: users?.map((u) => ({
					name: u.username || '',
					imageUrl: u.thumbnailUrl,
					address: u.address,
				})),
			},
			{
				gridSize: '3fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Ethereum Address' },
				renderComponent: EthAddress,
				renderComponentProps: users?.map((u) => ({ address: u.address })),
			},
			{
				gridSize: '2fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Role' },
				renderComponent: EntryRole,
				renderComponentProps: users?.map((u) => ({
					id: u.address,
					dispatchAllOptions: false,
					mode: tab,
					role: getHighestRole(u.roles),
					color: getRoleColor(getHighestRole(u.roles)),
					arrowGradient: getGradientColors(getHighestRole(u.roles)),
					options: [
						{
							label: 'admin',
							checked: u.roles?.includes('admin'),
							cb: (e) => e.roles?.includes('admin'),
							value: 'admin',
							disabled: false,
						},
						{
							label: 'verified',
							checked: u.roles?.includes('verified_user'),
							cb: (e) => e.roles?.includes('verified_user'),
							value: 'verified_user',
							disabled: false,
						},
						{
							label: 'inactive',
							checked: u.roles?.includes('inactivated_user'),
							cb: (e) => e.roles?.includes('inactivated_user'),
							value: 'inactivated_user',
							disabled: false,
						},
					],
				})),
			},
			{
				gridSize: '2fr',
				titleRenderComponent: TableTitle,
				titleRenderComponentProps: { title: 'Date Joined', sortBy: 'CREATED_AT', active: false },
				renderComponent: EntryGenericText,
				renderComponentProps: users?.map((u) => {
					let date = dayjs(u.createdAt);
					return { text: date.format('DD - MMM - YYYY') };
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

		// sorting functionality
		userTableData.forEach((e, i) => {
			e.titleRenderComponentProps.id = i;
			if (i === eventId) e.titleRenderComponentProps.active = true;
		});

		loaded = true;
	}

	$: searchPlaceholder = `Search for ${tab.toLowerCase()}`;
</script>

<div class="flex flex-col w-full h-full max-w-screen-2xl mx-auto pt-24 p-8">
	<div class="flex gap-x-14 gap-y-4 flex-wrap relative max-w-max z-[1]">
		<div class="tab btn" class:selected-tab={tab === 'USER'} on:click={() => (tab = 'USER')}>
			User Management
		</div>
		<div
			class="tab btn"
			class:selected-tab={tab === 'COLLECTION'}
			on:click={() => (tab = 'COLLECTION')}
		>
			Collection Management
		</div>
		<div
			class="tab btn"
			class:selected-tab={tab === 'NOTIFICATIONS'}
			on:click={() => (tab = 'NOTIFICATIONS')}
		>
			Notifications
		</div>
		<div class="tab btn" class:selected-tab={tab === 'TOS'} on:click={() => (tab = 'TOS')}>
			Terms of service
		</div>

		<!-- Line under tabs -->
		<div class="absolute h-[2px] left-0 right-0 bg-white bg-opacity-10 -bottom-2 " />
	</div>

	{#if ['USER', 'COLLECTION'].includes(tab)}
		<div class="flex gap-4 mt-8">
			{#if tab === 'USER'}
				<SearchBar bind:query={userFetchingOptions.query} placeholder={searchPlaceholder} />
				<div class="flex-grow" />
				<div class="flex gap-10">
					<div class="">
						<Filter on:filter={handleFilter} options={roleFilterOptions} icon={UserManage} />
					</div>
					<div class="">
						<Filter
							on:filter={handleFilter}
							options={userFilterOptions}
							icon={Filters}
							defaultOption={{ label: 'Filter', createdAfter: 'all' }}
						/>
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
						<Filter
							on:filter={handleFilter}
							options={collectionFilterOptions}
							icon={Filters}
							defaultOption={{ label: 'Filter', value: 'ALL' }}
						/>
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<div class="mt-8">
		{#if tab === 'USER'}
			<LoadedContent {loaded}>
				<InteractiveTable
					on:event={handleTableEvent}
					tableData={userTableData}
					rows={users.length}
					tableFooterElement={{
						element: PaginationFooter,
						props: { pages: Math.ceil(totalUserEntries / fetchLimit), items: totalUserEntries },
					}}
				/>
			</LoadedContent>
		{:else if tab === 'COLLECTION'}
			<LoadedContent {loaded}>
				<InteractiveTable
					on:event={handleTableEvent}
					tableData={collectionTableData}
					rows={collections.length}
					tableFooterElement={{
						element: PaginationFooter,
						props: {
							pages: Math.ceil(100 / fetchLimit),
							// 🔥🛠 for BE not returning total collections
							items: 100,
						},
					}}
				/>
			</LoadedContent>
		{:else if tab === 'NOTIFICATIONS'}
			<NotificationsManagement />
		{:else if tab === 'TOS'}
			<TosManagement />
		{/if}
	</div>

	{#if tab === 'COLLECTION'}
		<div>
			<!-- <h2 class="text-xl font-bold text-gradient">Add address to Whitelisted Collections</h2> -->
			<div class="flex flex-col w-full gap-10 mt-20">
				<!-- Network picker -->
				<!-- <div class="flex flex-col gap-1 w-[36rem]">
					<div class="font-semibold">Network to check address against</div>
					<Dropdown options={networkPickerOptions} bind:selected={$selectedNetworkOption} />
				</div> -->

				<div class="flex flex-col gap-5 text-white">
					<div class="font-semibold">Opensea collection URL part</div>
					<div class="flex gap-10">
						<input
							type="text"
							class="input max-w-xl w-[36rem] py-4"
							placeholder="Please input opensea route, e.g. azuki"
							bind:value={$whitelistingCollectionSlug}
						/>
					</div>
				</div>
				<div class="flex flex-col gap-5">
					<div class="font-medium text-white">Add address to Whitelisted Collections</div>
					<div class="flex justify-between">
						<input
							type="text"
							class="input text-white max-w-xl w-[36rem]"
							placeholder="Please input contract address"
							bind:value={$whitelistingCollectionAddress}
						/>

						<div class="p-[2px]">
							<PrimaryButton
								extButtonClass="w-80"
								disabled={!$whitelistingCollectionAddress || validating || !formValid}
								on:click={handleVerify}
							>
								Add
							</PrimaryButton>
						</div>
					</div>
				</div>

				{#if validating}
					<div class="flex items-center">
						<Loader class="w-6 mx-2" />
						<div class="font-medium text-white">Validating...</div>
					</div>
				{/if}

				{#if whitelisting}
					<div class="flex items-center">
						<Loader class="w-6 mx-2" />
						<div class="font-medium text-white">Whitelisting...</div>
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
	.tab {
		@apply font-medium text-2xl relative text-white select-none z-20;
	}

	.selected-tab {
		@apply bg-gradient-to-r from-color-purple to-color-blue text-transparent bg-clip-text;
	}

	.selected-tab::after {
		content: '';
		@apply absolute w-full -bottom-2 left-0 h-[2px];
		@apply bg-gradient-to-r from-color-purple to-color-blue;
	}
</style>
