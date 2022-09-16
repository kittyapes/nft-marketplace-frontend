<script lang="ts">
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';
	import CardList from '$lib/components/CardList.svelte';
	import CollectionCard from '$lib/components/CollectionCard.svelte';
	import CreateNewCollectionCard from '$lib/components/my-collections/CreateNewCollectionCard.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { adaptCollectionToCollectionCard } from '$utils/adapters/adaptCollectionToCollectionCard';
	import { apiSearchCollections, type Collection } from '$utils/api/collection';
	import { notifyError } from '$utils/toast';
	import { isEthAddress } from '$utils/validator/isEthAddress';

	let userCollections: Collection[] = [];
	let data: {
		title: string;
		slug: string;
		logoUrl: string;
		bannerUrl: string;
	}[] = [];
	let loaded = false;

	$: address = $page.params.address;

	const getUserCollections = async (address: string) => {
		if (!isEthAddress(address)) {
			notifyError('Invalid Ethereum Address');
			setTimeout(() => goto('/404'), 1500);
			return;
		}

		loaded = false;

		// Clear collections when the user address has changed
		if (userCollections.length > 0 && userCollections[0]?.creator.toLowerCase() !== address.toLowerCase()) {
			userCollections = [];
		}

		let page = 1;

		while (true) {
			const beforeLength = userCollections.length;

			userCollections.push(...(await apiSearchCollections({ creator: address ?? $currentUserAddress, page, sortBy: 'CREATED_AT', sortReversed: true }).catch((err) => [])));

			if (beforeLength === userCollections.length) break;
			page++;
		}

		data = await Promise.all(userCollections.filter((c) => c.logoImageUrl && c.backgroundImageUrl).map((c) => adaptCollectionToCollectionCard(c, address)));
		loaded = true;
	};

	$: address && getUserCollections(address);
</script>

<CardList
	title={address === $currentUserAddress ? 'My collections' : 'User Collections'}
	backFunction={() => window.history.back()}
	commonRenderComponent={CollectionCard}
	firstRenderComponent={CreateNewCollectionCard}
	commonComponentProps={data}
	showFirstComponent={$currentUserAddress === address}
	{loaded}
/>