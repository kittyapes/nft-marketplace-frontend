<script lang="ts">
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';
	import AddIcon from '$icons/add-icon.svelte';
	import LoadedContent from '$lib/components/LoadedContent.svelte';
	import GoBackHeader from '$lib/components/marketplace/UniversalPopup/GoBackHeader.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { apiSearchCollections } from '$utils/api/collection';

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
