<script lang='ts'>
	import CloseButton from '$icons/close-button.svelte';
	import { popupOpen, selectedCard } from '$stores/marketplace';
	import CardHistoryTab from '../CardHistoryTab.svelte';
	import CardInfoTab from './LimitedInfoTab.svelte';
	import TabSwitcher from './LimitedTabSwitcher.svelte';
	import CardClaimsTab from './CardClaimsTab.svelte';
	import { browser } from '$app/env';
	import Fullscreen from '$icons/fullscreen.svelte';
	import Share from '$icons/share.svelte';
	import { notifySuccess } from '$utils/toast';
	import Button from '$lib/components/Button.svelte';
	import { fade } from 'svelte/transition';
	import LongLeftArrow from '$icons/long-left-arrow.svelte';
	import SuccessCheckmark from '$icons/success-checkmark.svelte';
	import { onMount } from 'svelte';
	import HinataLogo from '$icons/hinata-logo.svelte';

	export let endingDate = new Date(2022, 2, 1);
	export let claimed = 20;
	export let remainingNfts: number = 225;

	let today = new Date();

	onMount(() => {
		const interval = setInterval(() => {
			today = new Date();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
	
	let endingIn = new Date(Math.abs(endingDate.getTime() - today.getTime()));

	$: {
		today;
		endingIn = new Date(Math.abs(endingDate.getTime() - today.getTime()));
	}
	function handleShare() {
		navigator.clipboard.writeText(window.location.href);
		notifySuccess('Copied NFT link!');
	}

	let tab = 0;
	let buyScreen = false;
	let successScreen = false;
	let inputBid: number | string;
</script>

<div
	class="z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center p-8 lg:p-0"
	class:hidden={!browser}
>
	<!-- Dark overlay -->
	<div class="fixed w-full h-full bg-gray-900 opacity-50" />

	<!-- Modal -->
	<div
		class="bg-white w-full lg:w-2/3  mx-auto rounded-xl shadow-xl z-50 flex flex-col md:flex-row overflow-y-scroll md:overflow-y-hidden"
		style="height:640px"
	>
		<!-- NFT Image side-->
		<div class="w-full md:w-1/2 bg-gray-200 h-auto flex items-center justify-center">
			<div class="m-10 text-center h-full flex flex-col justify-end">
				<div class=" w-72 h-72 flex items-center justify-center">
					<img
						src={$selectedCard?.image}
						class="max-w-full max-h-full shadow-xl rounded-xl"
						alt="card artwork"
					/>
				</div>

				<!-- NFT Name and ID-->
				<div class="font-bold text-lg mt-4 opacity-70">
					{$selectedCard?.name} #{$selectedCard?.id}
				</div>

				<!-- Fullscreen and Share button -->
				<div class="flex justify-center mt-24 mb-8 gap-x-4">
					<a
						href={$selectedCard?.image}
						target="_blank"
						class="transition-btn hover:brightness-110"
					>
						<Fullscreen />
					</a>

					<button class="transition-btn hover:brightness-110" on:click={handleShare}>
						<Share />
					</button>
				</div>
			</div>
		</div>

		<!-- Content Side-->
		<div class="w-full md:w-1/2 bg-white p-8 flex flex-col h-full">
			{#if buyScreen}
				<div in:fade={{ duration: 300 }} class="h-full flex flex-col justify-between">
					<div class='mt-2'>
						<button class='flex items-center gap-2 ml-auto' on:click={() => {buyScreen = false; successScreen = false;}}>
							<LongLeftArrow/>
							<p class='text-color-black font-semibold text-sm'>GO BACK</p>
						</button>
						<div class="h-px w-full mt-1 bg-color-black bg-opacity-30" />
					</div>
					<div class='flex gap-4 flex-col place-items-center'>
						<div class='w-[95%] grid place-items-center relative'>
							<input bind:value={inputBid} type='number' class='w-full p-2 rounded-md border border-color-black text-2xl' placeholder=00.00>
							<button class='rounded-md bg-color-black text-white font-semibold text-xl px-12 py-4 absolute right-0 ml-10'><HinataLogo></HinataLogo></button>
						</div>
						<div class='flex flex-col place-self-start ml-3 gap-3'>
							<div class='flex gap-2'>
								<p class='text-color-gray-base'>Creator gets: </p>
								<p class='text-color-black font-bold'> 0 Hi</p>
							</div>
							<div class='flex gap-2'>
								<p class='text-color-gray-base'>Royalties: </p>
								<p class='text-color-black font-bold'> 0 Hi</p>
								<button class='ml-1 rounded-full bg-color-gray-lighter px-2'><p>?</p></button>
							</div>
							<div class='flex gap-2'>
								<p class='text-color-gray-base'>Platform fee: </p>
								<p class='text-color-black font-bold'> 0 Hi</p>
							</div>
							<div class='flex gap-2'>
								<p class='text-color-gray-base'>Total bid: </p>
								<p class='text-color-black font-bold'> 0 Hi</p>
							</div>
						</div>
					</div>
					<div>
						<div class="w-full border-t border-color-black border-opacity-30 flex">
							<div class="w-1/2 border-r border-color-black border-opacity-30 pt-2">
								<div class="text-sm text-color-black opacity-70 ">NFTs remaining</div>
								<div class="text-2xl text-color-black font-semibold">
									{remainingNfts}
								</div>
							</div>
				
							<div class="w-1/2  pt-2 pl-4">
								<div class="text-sm text-color-black opacity-70 ">Claimed</div>
								<div class="text-2xl text-color-black font-semibold">
									{claimed}
								</div>
							</div>
						</div>
						<div class="w-full mt-3 mb-5 flex flex-row gap-4" on:click={() => {successScreen = true; buyScreen = false;}}>
							<Button gradient rounded stretch>BUY</Button>
						</div>
					</div>
				</div>
			{:else if successScreen}
			<div in:fade={{ duration: 300 }} class="h-full flex flex-col justify-between">
				<div class='mt-2'>
					<button class='flex items-center gap-2 ml-auto' on:click={() => {buyScreen = true; successScreen = false;}}>
						<LongLeftArrow/>
						<p class='text-color-black font-semibold text-sm'>GO BACK</p>
					</button>
					<div class="h-px w-full mt-1 bg-color-black bg-opacity-30" />
				</div>
				<div class='grid place-items-center gap-3'>
					<SuccessCheckmark></SuccessCheckmark>
					<p class='font-semibold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-color-purple to-color-blue'>Congratulations!</p>
					<p class='text-color-black text-xl'>You have claimed your limited NFT</p>
				</div>
				<div />
			</div>
			{:else}
					<!-- Tabs container -->
				<div class="w-full flex items-center justify-between">
					<!-- Tabs -->
					<TabSwitcher bind:selectedTab={tab} />

					<!-- Close button-->
					<button>
						<CloseButton />
					</button>
				</div>

				<!-- Horizontal Line -->
				<div class="h-px w-full mt-1 bg-color-black bg-opacity-30" />

				<!-- Selected Tab Content -->
				<div class="py-5 flex-grow overflow-hidden">
					{#if tab == 0}
						<CardInfoTab {endingIn} on:click={() => buyScreen = true}/>
					{:else if tab == 1}
						<CardClaimsTab {endingIn} on:click={() => buyScreen = true} />
					{:else if tab == 2}
						<CardHistoryTab />
					{/if}
				</div>
			{/if}
			<!-- Horizontal Line -->
			<div class="h-px w-full mt-1 bg-color-black bg-opacity-30" />
		</div>
	</div>
</div>