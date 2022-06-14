<script lang="ts">
	import { page } from '$app/stores';
	import CardList from '$lib/components/CardList.svelte';
	import CollectionCard from '$lib/components/CollectionCard.svelte';
	import CreateNewCollectionCard from '$lib/components/my-collections/CreateNewCollectionCard.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { adaptCollectionToCollectionCard } from '$utils/adapters/adaptCollectionToCollectionCard';
	import { apiSearchCollections, type Collection } from '$utils/api/collection';

	let userCollections: Collection[] = [];
	let data: {
		title: string;
		slug: string;
		logoUrl: string;
		bannerUrl: string;
	}[] = [];

	$: address = $page.params.address;

	const getUserCollections = async (address: string) => {
		userCollections = await apiSearchCollections(address);
		data = await Promise.all(userCollections.filter((c) => c.logoImageUrl && c.backgroundImageUrl).map((c) => adaptCollectionToCollectionCard(c, address)));
	};

	$: address && $currentUserAddress && getUserCollections(address);
</script>

<CardList
	title={'My collections'}
	backFunction={() => window.history.back()}
	commonRenderComponent={CollectionCard}
	firstRenderComponent={CreateNewCollectionCard}
	commonComponentProps={data}
	showFirstComponent={$currentUserAddress === address}
/>
