<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Search from '$icons/search.svelte';
	import CardPopup from '$lib/components/CardPopup/CardPopup.svelte';
	import { setPopup } from '$utils/popup';
	import { selectedResultTab } from '$stores/search';
	import { compactNumberFormat } from '$utils/api';
	import { result } from 'lodash-es';
	import HinataBadge from '$icons/hinata-badge.svelte';

	export let tabs = ['Collections', 'NFTs', 'Users'];
	export let query: string;
	let activeTab = tabs[0];
	$selectedResultTab = tabs[0].toLowerCase();
	export let searchResults: {
		collections?: any[];
		items?: any[];
		users?: any[];
	} = {};
	let hoveredId = '';
	$: console.log(searchResults.collections[0]);
</script>

<div>
	<div class="relative flex flex-row items-center gap-x-7 2xl:gap-x-8 text-xs 2xl:text-base leading-5 2xl:leading-6 mb-4 2xl:mb-5">
		{#each tabs as tab}
			<button
				type="button"
				on:click={() => {
					$selectedResultTab = tab.toLowerCase();
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
			{#if searchResults['collections']?.length > 0}
				{#each searchResults['collections'] as result}
					<div
						class="flex gap-4 items-center pt-1.5 pb-3 px-5 -mx-5 btn"
						on:click={() => {
							query = '';
							goto('/collections/' + result.slug);
						}}
						on:focus={() => (hoveredId = result?.collectionAddress)}
						on:mouseenter={() => (hoveredId = result?.collectionAddress)}
						on:mouseleave={() => (hoveredId = '')}
						on:blur={() => (hoveredId = '')}
						class:bg-gradient-a={hoveredId === result?.collectionAddress}
					>
						{#if result.logoImageUrl}
							<div class="w-11 h-11 2xl:w-12 2xl:h-12 bg-cover" style="background-image: url({result.logoImageUrl})" />
						{:else}
							<div class="w-11 h-11 2xl:w-12 2xl:h-12 min-w-[40px] border-gradient" />
						{/if}
						<div class="font-medium flex items-center justify-between text-xs 2xl:text-base leading-5 2xl:leading-6 w-full max-w-full truncate ">
							<div class="flex flex-col">
								<div class="flex items-center gap-x-2">
									<p>{result?.name}</p>
									{#if result?.verified}
										<HinataBadge class="w-5 2xl:w-6 h-5 2xl:h-6" />
									{/if}
								</div>
								<p class="opacity-70">
									Floor: {compactNumberFormat(result?.floorPrice || 0)}
									{result?.paymentTokenTicker}
									{result?.blockchain}
								</p>
							</div>
							<p class="font-semibold">{compactNumberFormat(result?.totalVol || 0)} {result?.paymentTokenTicker}</p>
						</div>
					</div>
				{/each}
				<button
					on:click={() => {
						$page.url.searchParams.set('query', query);
						query = '';
						goto(`/search/collections?${$page.url.searchParams}`);
					}}
					class="flex items-center gap-4"
				>
					<div class="w-11 h-11 2xl:w-12 2xl:h-12 min-w-[40px] border border-white bg-gradient-a flex items-center justify-center">
						<Search class="w-5 h-6" />
					</div>
					<p class="font-medium text-xs 2xl:text-base leading-5 2xl:leading-6">See all collections</p>
				</button>
			{:else}
				<div class="w-full flex justify-center py-12 text-lg font-semibold">No collections found.</div>
			{/if}
		{:else if activeTab === tabs[1]}
			{#if searchResults['items']?.length > 0}
				{#each searchResults['items'] as result}
					{@const props = result.nfts[0]}
					<div
						class="flex gap-4 items-center px-5 pt-1.5 pb-3 -mx-5"
						on:click={() => {
							setPopup(CardPopup, { props: { options: result }, onClose: () => {} });
							query = '';
						}}
						on:focus={() => (hoveredId = props?.databaseId)}
						on:mouseenter={() => (hoveredId = props?.databaseId)}
						on:mouseleave={() => (hoveredId = '')}
						on:blur={() => (hoveredId = '')}
						class:bg-gradient-a={hoveredId === props?.databaseId}
					>
						{#if props.thumbnailUrl}
							<div class="w-11 h-11 2xl:w-12 2xl:h-12 min-w-[40px] bg-cover" style="background-image: url({props.thumbnailUrl})" />
						{:else}
							<div class="w-11 h-11 2xl:w-12 2xl:h-12 min-w-[40px] border-gradient" />
						{/if}
						<div class="font-medium text-xs 2xl:text-base leading-5 2xl:leading-6 w-full max-w-full truncate ">
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
					<p class="font-medium text-xs 2xl:text-base leading-5 2xl:leading-6">See all NFTs</p>
				</button>
			{:else}
				<div class="w-full flex justify-center py-12 text-lg font-semibold">No NFTs found.</div>
			{/if}
		{:else if activeTab === tabs[2]}
			{#if searchResults['users']?.length > 0}
				{#each searchResults['users'] as result}
					<div
						class="flex gap-4 items-center pt-1.5 pb-3 px-5 -mx-5 btn"
						on:click={() => {
							query = '';
							goto('/profile/' + result.address);
						}}
						on:focus={() => (hoveredId = result?.address)}
						on:mouseenter={() => (hoveredId = result?.address)}
						on:mouseleave={() => (hoveredId = '')}
						on:blur={() => (hoveredId = '')}
						class:bg-gradient-a={hoveredId === result?.address}
					>
						{#if result.thumbnailUrl}
							<div class="w-11 h-11 2xl:w-12 2xl:h-12 bg-cover" style="background-image: url({result.thumbnailUrl})" />
						{:else}
							<div class="w-11 h-11 2xl:w-12 2xl:h-12 min-w-[40px] border-gradient" />
						{/if}
						<div class="font-medium flex items-center justify-between text-xs 2xl:text-base leading-5 2xl:leading-6 w-full max-w-full truncate ">
							<div class="flex flex-col">
								<div class="flex items-center gap-x-2">
									<p>{result?.username}</p>
									{#if result?.status === 'VERIFIED'}
										<HinataBadge class="w-5 2xl:w-6 h-5 2xl:h-6" />
									{/if}
								</div>
								<p class="opacity-70">
									{result?.followers || 0} followers
								</p>
							</div>
						</div>
					</div>
				{/each}
				<button
					on:click={() => {
						$page.url.searchParams.set('query', query);
						query = '';
						goto(`/search/users?${$page.url.searchParams}`);
					}}
					class="flex items-center gap-4"
				>
					<div class="w-11 h-11 2xl:w-12 2xl:h-12 min-w-[40px] border border-white bg-gradient-a flex items-center justify-center">
						<Search class="w-5 h-6" />
					</div>
					<p class="font-medium text-xs 2xl:text-base leading-5 2xl:leading-6">See all users</p>
				</button>
			{:else}
				<div class="w-full flex justify-center py-12 text-lg font-semibold">No users found.</div>
			{/if}
		{/if}
	</div>
</div>
