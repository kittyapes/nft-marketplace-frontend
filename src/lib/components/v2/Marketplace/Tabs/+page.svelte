<script lang="ts">
	import { goto } from '$app/navigation';

	export let tabs: { title: string; route: string }[] = [
		{
			title: 'Collections',
			route: '/marketplace/collections',
		},
		{
			title: 'Users',
			route: '/marketplace/users',
		},
		{
			title: 'NFTs',
			route: '/marketplace/nfts',
		},
	];
	let activeTab = tabs[0].title;
</script>

<div class="flex flex-row items-center gap-x-6 2xl:gap-x-8 text-xl 2xl:text-2xl leading-5 2xl:leading-6">
	{#each tabs as tab}
		<button
			type="button"
			on:click={() => {
				activeTab = tab.title;
				goto(tab.route);
			}}
			class:text-gradient={activeTab === tab.title}
			class="flex flex-col gap-y-0.5  p-0"
		>
			<span>{tab.title}</span>
			<div class:hidden={tab.title !== activeTab} class="h-0.5 w-full bg-white" />
		</button>
	{/each}
</div>
