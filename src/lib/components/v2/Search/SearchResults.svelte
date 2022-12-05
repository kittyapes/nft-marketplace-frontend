<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Search from '$icons/search.svelte';
	import CardPopup from '$lib/components/CardPopup/CardPopup.svelte';
	import { setPopup } from '$utils/popup';

	export let tabs = ['NFTs', 'Collections', 'Users'];
	export let query: string;
	let activeTab = tabs[0];
	export let searchResults: {
		collections?: any[];
		items?: any[];
		users?: any[];
	} = {};
</script>

<div>
	<div class="relative flex flex-row items-center gap-x-7 2xl:gap-x-8 text-xs 2xl:text-base leading-5 2xl:leading-6 mb-4 2xl:mb-5">
		{#each tabs as tab}
			<button
				type="button"
				on:click={() => {
					activeTab = tab;
				}}
				class:text-gradient={activeTab == tab}
				class="relative flex flex-col gap-y-0.5  p-0"
			>
				<span>{tab}</span>
				<div class:hidden={activeTab !== tab} class="relative z-10 h-px w-full bg-main-gradient" />
			</button>
		{/each}
		<div class="absolute bottom-0 w-full h-px bg-white" />
	</div>
	<div>
		{#if activeTab === tabs[0]}
			{#if searchResults['items']?.length > 0}
				{#each searchResults['items'] as result}
					{@const props = result.nfts[0]}
					<div
						class="flex gap-4 items-center px-5 pt-1.5 pb-3 -mx-5"
						on:click={() => {
							setPopup(CardPopup, { props: { options: result }, onClose: () => {} });
						}}
					>
						{#if props.thumbnailUrl}
							<div class="w-11 h-11 2xl:w-12 2xl:h-12 min-w-[40px] bg-cover" style="background-image: url({props.thumbnailUrl})" />
						{/if}
						<div class="font-semibold w-full max-w-full truncate">
							{props.name}
						</div>
					</div>
				{/each}
				<button
					on:click={() => {
						$page.url.searchParams.set('query', query);
						query = '';
						goto(`/search/nfts?${$page.url.searchParams}`);
					}}
					class="flex items-center gap-4"
				>
					<div class="w-11 h-11 2xl:w-12 2xl:h-12 min-w-[40px] border border-white bg-gradient-a flex items-center justify-center">
						<Search class="w-5 h-6" />
					</div>
					<p>See all NFTs</p>
				</button>
			{:else}
				<div class="w-full flex justify-center py-12 text-lg font-semibold">No NFTs found.</div>
			{/if}
		{:else if activeTab === tabs[1]}
			{#if searchResults['collections']?.length > 0}
				{#each searchResults['collections'] as result}
					<div
						class="flex gap-4 items-center btn"
						on:click={() => {
							// searching = false;
							goto('/collections/' + result.slug);
						}}
					>
						{#if result.logoImageUrl}
							<div class="w-11 h-11 2xl:w-12 2xl:h-12 bg-cover" style="background-image: url({result.logoImageUrl})" />
						{/if}
						<div class="font-semibold w-full max-w-full truncate">
							{result.name}
						</div>
					</div>
				{/each}
			{:else}
				<div class="w-full flex justify-center py-12 text-lg font-semibold">No collections found.</div>
			{/if}
		{:else if activeTab === tabs[2]}
			{#if searchResults['users']?.length > 0}
				{#each searchResults['users'] as result}
					<div
						class="flex gap-4 items-center btn"
						on:click={() => {
							// searching = false;
							goto('/profile/' + result.address);
						}}
					>
						{#if result.thumbnailUrl}
							<div class="w-12 h-12 rounded-full grid place-items-center">
								<div class="w-12 h-12 bg-cover rounded-full" style="background-image: url({result.thumbnailUrl})" />
							</div>
						{/if}
						<div class="">
							<div class="font-semibold username w-full max-w-full truncate">
								{result.username}
							</div>
						</div>
					</div>
				{/each}
			{:else}
				<div class="w-full flex justify-center py-12 text-lg font-semibold">No users found.</div>
			{/if}
		{/if}
	</div>
</div>
