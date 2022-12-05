<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	export let tabs: { title: string; route: string }[] = [
		{
			title: 'Collections',
			route: '/marketplace/collections',
		},
		// {
		// 	title: 'Users',
		// 	route: '/marketplace/users',
		// },
		{
			title: 'Active Listings',
			route: '/marketplace/listings',
		},
	];
</script>

<div class="flex flex-row items-center gap-x-6 2xl:gap-x-8 font-semibold text-xl 2xl:text-2xl leading-5 2xl:leading-6">
	{#each tabs as tab}
		<button
			type="button"
			on:click={() => {
				goto(tab.route);
			}}
			class:text-gradient={tab.route === $page.url.pathname}
			class="flex flex-col gap-y-0.5  p-0"
		>
			<span>{tab.title}</span>
			<div class:hidden={tab.route !== $page.url.pathname} class="h-0.5 w-full bg-white" />
		</button>
	{/each}
</div>
