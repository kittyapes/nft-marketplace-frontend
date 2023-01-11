<script>
	import { slide } from 'svelte/transition';
	import Popup from '../Popup.svelte';

	export const airdrop = {
		title: 'Claim your monthly airdrop',
		textPreview:
			'The Hinata marketplace will be doing an airdrop for active users in the coming months. Buyers, sellers and minters will all be eligible to claim tokens after the token generation event later this year.',
		thumbnail: '/img/png/airdrop-banner.png',
	};

	let showAirdropInfo = false;
</script>

<div class="mt-24 mb-16 w-full">
	<div class="flex items-end mb-12">
		<h2 class="text-4xl leading-none font-semibold text-white uppercase flex-grow">Monthly Airdrop</h2>
	</div>

	<div
		class="flex flex-col h-full pr-4 overflow-hidden transition duration-100 cursor-pointer lg:flex-row lg:gap-32 hover:bg-[#FFFFFF1E] bg-card-gradient"
		on:click={() => {
			showAirdropInfo = !showAirdropInfo;
		}}
	>
		<div class="flex-shrink-0 h-full max-w-2xl">
			<img src={airdrop.thumbnail} alt="" class="object-cover h-full" style="aspect-ratio: 420/250;" />
		</div>

		<div class="flex flex-col flex-grow text-white pt-8 lg:py-20 h-full ">
			<div class="text-4xl font-light uppercase line-clamp-2">
				{airdrop.title}
			</div>

			<p class="flex-grow mt-8">
				{airdrop.textPreview}
			</p>
		</div>
	</div>
</div>
{#if showAirdropInfo}
	<div class="mb-16" transition:slide>
		<Popup>
			<div class="flex items-center justify-center w-[80vw]">
				<img src={airdrop.thumbnail} alt="airdrop-full" class="w-full" />
			</div>
		</Popup>
	</div>
{/if}
