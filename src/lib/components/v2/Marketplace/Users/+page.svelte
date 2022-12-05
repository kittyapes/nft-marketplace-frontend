<script lang="ts">
	import type { UserData } from '$interfaces/userData';
	import SortButton from '$components/v2/SortButton/+page.svelte';
	import UserGrid from '$components/v2/Marketplace/Users/UserGrid.svelte';
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
	<div class="w-full flex flex-row items-center justify-end gap-x-4 my-6 2xl:my-8">
		<SortButton bind:sortOptions class="h-11 2xl:h-14 max-w-[123px]" />
	</div>
	<UserGrid bind:users />
</div>
