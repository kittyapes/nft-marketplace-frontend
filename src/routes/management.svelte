<script lang="ts">
	import EntryName from '$lib/components/management/EntryName.svelte';
	import EthAddress from '$lib/components/management/EntryEthAddress.svelte';
	import InteractiveTable from '$lib/components/management/InteractiveTable.svelte';
	import TableTitle from '$lib/components/management/TableTitle.svelte';
	import type { TableCol } from 'src/interfaces/management/tableColumn';
	import SearchBar from '$lib/components/management/SearchBar.svelte';
	import RoleFilter from '$lib/components/management/RoleFilter.svelte';
	import Filter from '$lib/components/management/Filter.svelte';

	export let mode: 'USER' | 'COLLECTION' = 'USER';

	let dummyData: TableCol[] = [
		{
			gridSize: '1fr',
			titleRenderComponent: TableTitle,
			titleRenderComponentProps: { title: 'Name', sortable: true },
			renderComponent: EntryName,
			renderComponentProps: [
				{ name: 'Jakub', imageUrl: 'https://picsum.photos/200' },
				{ name: 'Pavel', imageUrl: 'https://picsum.photos/200' },
				{ name: 'Hobzič', imageUrl: 'https://picsum.photos/200' }
			]
		},
		{
			gridSize: '1fr',
			titleRenderComponent: TableTitle,
			titleRenderComponentProps: { title: 'Ethereum Adress' },
			renderComponent: EthAddress,
			renderComponentProps: [{ address: '0xb794f5ea0ba39494ce839613fffba74279579268' }, { name: '0xb794f5ea0ba39494ce839613fffba74279579268' }, { name: '0xb794f5ea0ba39494ce839613fffba74279579268' }]
		}
	];

	let roleFilterOptions = [{ label: 'All' }, { label: 'Verified Creator' }, { label: 'Admin' }, { label: 'Super Admin' }, { label: 'Blogger' }, { label: 'Inactive' }];
	let filterOptions = [{ label: 'Flagged' }, { label: 'Joined 24 hrs ago' }, { label: 'Joined 7 days ago' }, { label: 'Joined 1 Mon ago' }];

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
		<SearchBar placeholder={searchPlaceholder} />
		<div class="flex-grow" />
		<div class="flex gap-4">
			<RoleFilter options={roleFilterOptions} />
			<Filter options={filterOptions} />
		</div>
	</div>
	<InteractiveTable tableData={dummyData} />
</div>

<style lang="postcss">
	.gradient-underline::after {
		content: '';
		@apply absolute w-full -bottom-1 left-0 h-[2px];
		@apply bg-gradient-to-r from-color-purple to-color-blue;
	}
</style>
