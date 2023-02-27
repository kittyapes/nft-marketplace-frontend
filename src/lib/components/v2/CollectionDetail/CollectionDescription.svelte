<script lang="ts">
	import { outsideClickCallback } from '$actions/outsideClickCallback';
	import ShareV2 from '$icons/share-v2.svelte';
	import Artstation from '$icons/socials/artstation.svelte';
	import Deviantart from '$icons/socials/deviantart.svelte';
	import Discord from '$icons/socials/discord.svelte';
	import Instagram from '$icons/socials/instagram.svelte';
	import Pixiv from '$icons/socials/pixiv.svelte';
	import Twitter from '$icons/socials/twitter.svelte';
	import Web from '$icons/socials/web.svelte';
	import type { Collection } from '$utils/api/collection';
	import { slide } from 'svelte/transition';

	export let collectionData: Collection;

	let showSocials = false;
	let hoveredSocial = '';
	let socials: { name?: string; url?: string; component?: any }[] = [];

	$: if (collectionData?.twitterUrl) {
		socials.push({ name: 'Twitter', url: collectionData?.twitterUrl, component: Twitter });
	}

	$: if (collectionData?.instagramUrl) {
		socials.push({ name: 'Instagram', url: collectionData?.instagramUrl, component: Instagram });
	}

	$: if (collectionData?.websiteUrl) {
		socials.push({ name: 'Website', url: collectionData?.websiteUrl, component: Web });
	}

	$: if (collectionData?.deviantartUrl) {
		socials.push({ name: 'Deviantart', url: collectionData?.deviantartUrl, component: Deviantart });
	}

	$: if (collectionData?.artstationUrl) {
		socials.push({ name: 'Artstation', url: collectionData?.artstationUrl, component: Artstation });
	}

	$: if (collectionData?.discordUrl) {
		socials.push({ name: 'Discord', url: collectionData?.discordUrl, component: Discord });
	}

	$: if (collectionData?.pixivUrl) {
		socials.push({ name: 'Pixiv', url: collectionData?.pixivUrl, component: Pixiv });
	}
</script>

<div class="flex items-center justify-between mt-8">
	<p class="w-1/2 font-semibold text-sm leading-6">{collectionData?.description || ''}</p>
	<div class="w-1/2 flex items-center justify-end gap-x-4">
		<div class="w-14 h-14 relative">
			<button
				type="button"
				on:click={() => {
					showSocials = !showSocials;
				}}
				class="w-full min-h-full border-gradient dull-gradient flex items-center justify-center transition-btn hover:bg-main-gradient"
			>
				<!-- TODO add share icon -->
				<ShareV2 class="w-6 h-6" />
			</button>
			{#if showSocials}
				<div
					use:outsideClickCallback={{
						cb: () => (showSocials = false),
					}}
					transition:slide|local
					class="absolute right-0 z-10 top-16 border-gradient py-6 px-6 bg-dark-gradient flex flex-row items-end gap-x-4 font-semibold text-sm"
				>
					{#if socials?.length > 0}
						{#each socials as social}
							<div class="relative flex flex-col items-center ">
								<p class:hidden={hoveredSocial !== social.name} class="absolute -top-5">{social.name}</p>
								<a
									href={social.url}
									target="_blank"
									on:mouseenter={() => (hoveredSocial = social.name)}
									on:mouseleave={() => (hoveredSocial = '')}
									class="w-9 h-9 flex items-center justify-center transition-btn {hoveredSocial === social.name ? 'border-gradient' : 'border-white border'}"
								>
									<svelte:component this={social.component} gradient={hoveredSocial == social.name} />
								</a>
							</div>
						{/each}
					{:else}
						<h2 class="whitespace-nowrap">This collection doesn't have social links.</h2>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
