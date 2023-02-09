<script lang="ts">
	import ShareWhite from '$icons/share-white.svelte';
	import Facebook from '$icons/socials/facebook.svelte';
	import Instagram from '$icons/socials/instagram.svelte';
	import Twitter from '$icons/socials/twitter.svelte';
	import Web from '$icons/socials/web.svelte';
	import VerifiedCheckmarkWhite from '$icons/verified-check-white.svelte';
	import CreatorFormScreen from '$lib/components/CreatorFormScreen.svelte';
	import LoadedContent from '$lib/components/LoadedContent.svelte';
	import { onMount } from 'svelte';
	import { outsideClickCallback } from '$actions/outsideClickCallback';
	import { slide } from 'svelte/transition';

	let username = 'Till Lindemann';
	let profilePictureUrl = 'https://picsum.photos/200';
	let bio =
		'Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullamco laboriosam, nisi ut aliquid ex ea commodi consequatur.';

	let showShare = false;
	let loaded: boolean = false;
	let gradient = true;
	let moveRight = false;

	onMount(() => {
		loaded = true;
	});
</script>

<LoadedContent {loaded}>
	<CreatorFormScreen step={4}>
		<div slot="header" class="max-w-3xl mb-5">
			<h1 class="font-bold uppercase text-7xl">
				<p>Share your</p>
				<p class="text-gradient">avatar</p>
			</h1>
		</div>
		<div slot="content" class="flex flex-col max-w-xl gap-8 mb-16">
			<p class="mb-6 text-sm font-light">
				Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullamco laboriosam,
				nisi ut aliquid ex ea commodi consequatur.
			</p>
			<h1 class="text-lg uppercase text-color-black">Sharing is caring</h1>
			<div class="relative grid w-full text-white bg-gradient-to-r from-color-purple to-color-blue rounded-2xl place-items-center py-9">
				<div class="grid w-11/12 h-full gap-x-4 place-items-center grid-cols-[1fr_3fr]">
					<div class="grid w-full h-full p-2 place-items-center">
						<div class="w-36 h-36">
							<div class="grid self-center w-full h-full bg-white rounded-full  place-items-center">
								<img src={profilePictureUrl} alt="Profile Picutre" class="rounded-full w-[85%] h-[85%]" />
							</div>
						</div>
					</div>
					<div class="flex flex-col gap-2 p-2 place-self-start">
						<div class="flex gap-3 text-left ">
							<h1 class="text-xl font-semibold ">{username}</h1>
							<VerifiedCheckmarkWhite />
						</div>
						<p class="font-light text-sm max-w-[15rem]">{bio}</p>
					</div>
				</div>
				<div class="absolute -bottom-5 right-[13%] grid place-items-center" class:right={moveRight} use:outsideClickCallback={{ cb: () => (showShare = false) }}>
					{#if showShare}
						<div class="flex gap-3 px-10 py-5 text-black bg-white rounded-lg bg-opacity-80" transition:slide on:outroend={() => (moveRight = false)}>
							<div
								class="icon"
								on:click={() => {
									/* twitter share */
								}}
							>
								<Twitter {gradient} />
							</div>
							<div
								class="icon"
								on:click={() => {
									/* facebook share */
								}}
							>
								<Facebook {gradient} />
							</div>
							<div
								class="icon"
								on:click={() => {
									/* instagram share */
								}}
							>
								<Instagram {gradient} />
							</div>
							<div
								class="icon"
								on:click={() => {
									/* web share */
								}}
							>
								<Web {gradient} />
							</div>
						</div>
						<div class="w-0 h-0 border-x-[0.75rem] border-t-[1rem] border-x-transparent border-t-white border-opacity-80 mb-1 bg-transparent" transition:slide />
					{/if}
					<button
						class="flex gap-2 btn btn-black btn-rounded "
						on:click={() => {
							showShare = !showShare;
							moveRight = true;
						}}
					>
						<ShareWhite />
						<p class="text-sm font-normal uppercase">Share</p>
					</button>
				</div>
			</div>
		</div>
	</CreatorFormScreen>
</LoadedContent>

<style type="postcss">
	.icon {
		@apply w-8 h-8 cursor-pointer brightness-0 hover:brightness-100;
	}

	.right {
		@apply right-[3.5%];
	}
</style>
