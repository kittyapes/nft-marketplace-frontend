<script lang="ts">
	import { page } from '$app/stores';
	import type { UserData } from '$interfaces/userData';
	import { currentUserAddress } from '$stores/wallet';
	import { apiGetCollection, Collection } from '$utils/api/collection';
	import { fetchProfileData } from '$utils/api/profile';
	import { shortenAddress } from '$utils/misc/shortenAddress';

	let collectionData: Collection;
	let creatorData: UserData;

	async function fetchCollectionData() {
		collectionData = await apiGetCollection($page.params.collectionId);
		creatorData = await fetchProfileData(collectionData.creator);

		console.log(creatorData);
	}

	$: $currentUserAddress && fetchCollectionData();
</script>

<main class="max-w-screen-lg mx-auto px-16">
	<div class="relative mt-8">
		<!-- Cover image -->
		<img
			class="object-cover w-full h-64 rounded-md"
			src={collectionData?.backgroundImageUrl ||
				'https://media.istockphoto.com/photos/abstract-geometric-network-polygon-globe-graphic-background-picture-id1208738316?b=1&k=20&m=1208738316&s=170667a&w=0&h=f4KWULKjL770nceDM6xi32EbfIgMtBwSp5fPxIx08wc='}
			alt=""
		/>

		<!-- Creator profile image -->
		<div class="absolute left-0 right-0 bottom-0 mx-auto w-24 h-24 translate-y-5">
			<img
				class="rounded-full
					border-4 border-white"
				src={creatorData?.thumbnailUrl}
				alt="Collection creator avatar."
			/>

			<!-- Verified creator badge -->
			<img class="right-0 absolute -translate-y-8" src="/svg/icons/verified-creator-badge.svg" alt="Verified creator badge." />
		</div>
	</div>

	<!-- Collection title -->
	<h1 class="mx-auto max-w-max mt-8 text-2xl font-semibold">{collectionData?.name}</h1>

	<!-- Creator username and address -->
	<div class="flex justify-center items-center space-x-3 mt-2">
		<div class="text-color-gradient text-xl max-w-max font-medium">@{creatorData?.username}</div>
		<div class="bg-[#F5F5F5] flex rounded-full px-4 py-2 space-x-2">
			<img class="w-5" src="/svg/icons/collection-gradient-eth.svg" alt="Ethereum." />
			<div class="font-mono text-[#6E6E6E] text-sm">{shortenAddress(creatorData?.address)}</div>
		</div>
	</div>
</main>

<pre>
    {$page.params.collectionId}
    {JSON.stringify(collectionData, null, 2)}
</pre>
