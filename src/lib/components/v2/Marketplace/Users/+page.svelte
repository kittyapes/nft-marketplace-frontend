<script lang="ts">
	import RefreshStretchedIcon from '$icons/refresh-stretched-icon.svelte';
	import Search from '$icons/search.svelte';
	import type { UserData } from '$interfaces/userData';
	import SortButton from '$components/v2/SortButton/+page.svelte';
	import Input from '$components/v2/Input/Input.svelte';
	import UserGrid from '$components/v2/Marketplace/Users/UserGrid.svelte';

	let searchPhrase;
	let sortOptions: { title: string; action?: any }[] = [
		{
			title: 'Ending soon',
			action: () => {},
		},
		{
			title: 'Price low to high',
			action: () => {},
		},
		{
			title: 'Price high to low',
			action: () => {},
		},
		{
			title: 'Most favorited',
			action: () => {},
		},
	];
	let users: UserData[];
</script>

<div>
	<div class="w-full flex flex-row items-center gap-x-4 my-6 2xl:my-8">
		<!-- TODO clarify what refresh does -->
		<button class="w-11 h-11 2xl:h-14 2xl:w-14 min-w-[40px] border-gradient flex-grow flex flex-row items-center justify-center transition-btn hover:bg-main-gradient">
			<RefreshStretchedIcon class="w-5 h-5" />
		</button>
		<Input bind:value={searchPhrase} class="rounded-none border-2 border-gradient h-11 2xl:h-14 hover:text-white" placeholder="Search by name or attribute" height="44px">
			<Search class="ml-6 w-5 h-6" />
		</Input>
		<SortButton bind:sortOptions class="h-11 2xl:h-14 min-w-[123px]" />
	</div>
	<UserGrid bind:users />
</div>
