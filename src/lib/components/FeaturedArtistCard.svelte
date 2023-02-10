<script lang="ts">
	import EthV2 from '$icons/eth-v2.svelte';
	import VerifiedBadge from '$icons/verified-badge.svelte';
	import { followUnfollowUser } from '$utils/api/following';
	import { apiGetUserNfts } from '$utils/api/nft';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import EthAddress from './EthAddress.svelte';
	import PrimaryButton from './v2/PrimaryButton/PrimaryButton.svelte';

	export let creatorData: {
		name: string;
		address: string;
		coverImg: string;
		profileImg: string;
		created?: number;
	};

	export let includeCreatedNumber = true;
	export let followed = false;

	let isLoading = true;

	const pageNumber = 1;
	const mintedNftLimit = 1;

	async function handleFollow() {
		followed = await followUnfollowUser(creatorData.address, !followed);
	}

	async function fetchCreatedData() {
		isLoading = true;

		const res = await apiGetUserNfts(creatorData.address, 'MINTED', pageNumber, mintedNftLimit);
		creatorData.created = res.res.totalCount;

		isLoading = false;
	}

	onMount(() => {
		if (!creatorData.created) {
			fetchCreatedData();
		}
	});
</script>

<button class="flex flex-col relative wrapper overflow-hidden aspect-[1.5] w-full h-full" on:click>
	<div class="absolute inset-0 gradient-border animate-gradient-border-spin" />

	<div class="w-full h-full flex-shrink flex-grow overflow-hidden bg-color-purple">
		{#if creatorData.coverImg}
			<img src={creatorData.coverImg} alt="Featured creator cover." class="w-full h-full object-cover" />
		{/if}
	</div>

	<div class="bg-card-gradient flex flex-col items-center justify-center flex-shrink-0 w-full p-4 h-36">
		<div class="max-w-full w-full flex justify-between">
			<div class="flex gap-4 flex-shrink overflow-hidden">
				<div class="w-24 h-24 flex-shrink-0">
					<img src={creatorData.profileImg} alt="Featured crator profile." class="h-full object-cover object-top w-full" />
				</div>

				<div class="flex flex-col justify-between flex-shrink overflow-hidden">
					<div class="flex gap-2 items-center ">
						<div class="text-2xl 2xl:text-3xl text-white whitespace-nowrap truncate">{creatorData.name}</div>
						<VerifiedBadge />
					</div>

					<div class="bg-card-gradient p-1 flex items-center gap-2 w-fit">
						<EthV2 />
						<EthAddress address={creatorData.address} concat class="!text-white" />
					</div>
				</div>
			</div>

			<div class="flex flex-col justify-between items-end flex-shrink-0">
				<button on:click|stopPropagation={handleFollow} class="ml-2">
					<PrimaryButton extButtonClass="w-40">{followed ? 'Unfollow' : 'Follow'}</PrimaryButton>
				</button>

				{#if includeCreatedNumber}
					{#if isLoading}
						<div class="h-10 flex-shrink-0 bg-white bg-opacity-5 w-40" out:fade={{ duration: 200 }} />
					{:else}
						<div class="pr-2 font-medium">Created {creatorData.created}</div>
					{/if}
				{/if}
			</div>
		</div>
	</div>
</button>

<style type="postcss">
	.wrapper:not(:hover) > .gradient-border {
		display: none;
	}
</style>
