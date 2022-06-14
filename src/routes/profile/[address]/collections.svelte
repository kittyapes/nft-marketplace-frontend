<script lang="ts">
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';
	import AddIcon from '$icons/add-icon.svelte';
	import EditIconWhite from '$icons/edit-icon-white.svelte';
	import LoadedContent from '$lib/components/LoadedContent.svelte';
	import GoBackHeader from '$lib/components/marketplace/UniversalPopup/GoBackHeader.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { apiSearchCollections } from '$utils/api/collection';
	import { log } from '$utils/debug';

	let collections = [];
	let loaded = true;

	$: (async (address: string) => {
		if (address) {
			loaded = false;
			collections = await apiSearchCollections($page.params.address).catch((err) => []);
			loaded = true;
		}
	})($page.params.address);
</script>

<LoadedContent {loaded}>
	<div class="user-collections">
		<div class="user-collections-header">
			<div class="go-back">
				<GoBackHeader class="border-none" />
			</div>
			<div class="heading">
				<div>My collections</div>
			</div>
		</div>
		<div class="collection-cards">
			{#if $currentUserAddress === $page.params.address}
				<div class="collection-card add-collection-btn" on:click={() => goto('/collections/new/edit?to=create')}>
					<AddIcon />
					<div class="card-text">Create New Collection</div>
				</div>
			{/if}
			{#each collections as collection}
				<div class="collection-card collection-card-with-image">
					<div class="click-zone" class:click-zone-shadow={$currentUserAddress === $page.params.address} on:click={() => goto(`/collections/${collection.name}`)} />
					{#if $currentUserAddress === $page.params.address}
						<button class="edit-icon" on:click|stopPropagation={() => $currentUserAddress === $page.params.address && goto(`/collections/${collection.name}/edit`)}>
							<EditIconWhite />
							Edit
						</button>
					{/if}
					<div class="collection-banner" style="background-image: url('{collection.backgroundImageUrl}')">
						<div class="collection-image" style="background-image: url('{collection.logoImageUrl}')" />
					</div>
					<div class="collection-name">{collection.name}</div>
				</div>
			{/each}
		</div>
	</div>
</LoadedContent>

<style lang="postcss">
	.user-collections {
		@apply max-w-screen-xl mx-auto my-10 h-full;
	}

	.user-collections-header {
		@apply flex flex-col w-full border-b mb-10;
	}

	.heading {
		@apply italic text-5xl font-extralight my-5;
	}

	.go-back {
		@apply flex items-start w-full;
	}

	.collection-cards {
		@apply grid min-w-full gap-3 p-2 my-5 mx-auto h-full;
		grid-template-columns: repeat(auto-fit, 270px);
		grid-template-rows: repeat(auto-fit, 220px);
	}

	.collection-card {
		@apply flex flex-col items-center justify-evenly min-w-[270px] min-h-[220px];
		@apply cursor-pointer relative transition-all;
	}

	.click-zone {
		@apply absolute top-0 left-0 right-0 bottom-0 z-10;
	}

	.edit-icon {
		@apply absolute top-2 right-2 w-16 rounded-3xl text-sm px-2 py-1 z-10;
		@apply hidden text-white items-center justify-evenly bg-gray-600;
	}

	.collection-card:hover {
		@apply scale-105;
	}

	.collection-card:hover > .edit-icon {
		@apply flex;
	}

	.collection-card:hover > .click-zone-shadow {
		@apply bg-white bg-opacity-25;
	}

	.add-collection-btn {
		@apply border border-dashed rounded-2xl cursor-pointer;
	}

	.collection-card-with-image {
		@apply items-start justify-start overflow-clip rounded-2xl border;
	}

	.collection-banner {
		@apply bg-cover bg-center bg-no-repeat h-[77%] w-full relative;
	}

	.collection-image {
		@apply w-7 h-7 rounded-full absolute -bottom-3 left-1/2 -translate-x-1/2 border-2 border-white;
		@apply bg-center bg-cover bg-no-repeat;
	}

	.collection-name {
		@apply flex items-center justify-center w-full h-[23%] font-medium;
	}
</style>
