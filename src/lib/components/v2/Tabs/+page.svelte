<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	export let tabs: { title: string; route: string }[] = [];
</script>

<div class="flex flex-row items-center gap-x-6 2xl:gap-x-8 font-semibold text-xl 2xl:text-2xl leading-5 2xl:leading-6">
	{#each tabs as tab}
		{@const selectedRoute = tab?.route?.includes('?') ? tab.route.slice(0, tab.route.indexOf('?')) : tab.route}
		<button type="button" on:click={() => goto(tab.route)} class:text-gradient={selectedRoute === $page.url.pathname} class="flex flex-col gap-y-0.5 p-0 relative">
			<span>{tab.title}</span>
			<div class:opacity-0={selectedRoute !== $page.url.pathname} class="h-0.5 w-full bg-gradient-to-r from-color-blue to-color-purple absolute -bottom-2" />
		</button>
	{/each}
</div>
