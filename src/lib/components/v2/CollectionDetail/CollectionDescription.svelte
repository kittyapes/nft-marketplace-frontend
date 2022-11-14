<script lang="ts">
	import Artstation from '$icons/socials/artstation.svelte';
	import Deviantart from '$icons/socials/deviantart.svelte';
	import Facebook from '$icons/socials/facebook.svelte';
	import Instagram from '$icons/socials/instagram.svelte';
	import Twitter from '$icons/socials/twitter.svelte';
	import Web from '$icons/socials/web.svelte';
	import type { Collection } from '$utils/api/collection';

	export let collectionData: Collection;
	let showSocials = false;
	let hoveredSocial = '';
</script>

<div class="flex items-center justify-between mt-11">
	<p class="w-1/2 font-semibold text-sm leading-6">{collectionData?.description || ''}</p>
	<div class="w-1/2 flex items-center justify-end gap-x-4">
		<div class="w-11 h-11 2xl:w-14 2xl:h-14 relative">
			<button
				type="button"
				on:click={() => {
					showSocials = !showSocials;
				}}
				class="w-full min-h-full border-gradient dull-gradient flex items-center justify-center transition-btn hover:bg-main-gradient"
			>
				<!-- TODO add share icon -->
			</button>
			<div class:hidden={!showSocials} class="absolute right-0 z-10 top-12 2xl:top-16 border-gradient py-5 2xl:py-7 px-5 2xl:px-6 bg-dark-gradient flex flex-row items-center gap-x-3 2xl:gap-x-4">
				<div class:hidden={collectionData?.facebookUrl} class="flex flex-col items-center gap-y-1 2xl:gap-y-1.5 font-semibold text-[10px] 2xl:text-sm">
					<p class:hidden={hoveredSocial !== collectionData?.facebookUrl}>Facebook</p>
					<a
						href={collectionData?.facebookUrl}
						target="_blank"
						on:mouseenter={() => (hoveredSocial = collectionData?.facebookUrl)}
						on:mouseleave={() => (hoveredSocial = '')}
						class="w-8 h-8 2xl:w-9 2xl:h-9 hover:border-gradient border border-white flex items-center justify-center transition-btn"
					>
						<Facebook gradient={hoveredSocial === collectionData?.facebookUrl} />
					</a>
				</div>
				<div class:hidden={collectionData?.twitterUrl} class="flex flex-col items-center gap-y-1 2xl:gap-y-1.5 font-semibold text-[10px] 2xl:text-sm">
					<p class:hidden={hoveredSocial !== collectionData?.twitterUrl}>Twitter</p>
					<a
						href={collectionData?.twitterUrl}
						target="_blank"
						on:mouseenter={() => (hoveredSocial = collectionData?.twitterUrl)}
						on:mouseleave={() => (hoveredSocial = '')}
						class="w-8 h-8 2xl:w-9 2xl:h-9 hover:border-gradient border border-white flex items-center justify-center transition-btn"
					>
						<Twitter gradient={hoveredSocial === collectionData?.twitterUrl} />
					</a>
				</div>
				<div class:hidden={!collectionData?.instagramUrl} class="flex flex-col items-center gap-y-1 2xl:gap-y-1.5 font-semibold text-[10px] 2xl:text-sm">
					<p class:hidden={hoveredSocial !== collectionData?.instagramUrl}>Instagram</p>
					<a
						href={collectionData?.instagramUrl}
						target="_blank"
						on:mouseenter={() => (hoveredSocial = collectionData?.instagramUrl)}
						on:mouseleave={() => (hoveredSocial = '')}
						class="w-8 h-8 2xl:w-9 2xl:h-9 hover:border-gradient border border-white flex items-center justify-center transition-btn"
					>
						<Instagram gradient={hoveredSocial === collectionData?.instagramUrl} />
					</a>
				</div>
				<div class:hidden={!collectionData?.websiteUrl} class="flex flex-col items-center gap-y-1 2xl:gap-y-1.5 font-semibold text-[10px] 2xl:text-sm">
					<p class:hidden={hoveredSocial !== collectionData?.websiteUrl}>Website</p>
					<a
						href={collectionData?.websiteUrl}
						target="_blank"
						on:mouseenter={() => (hoveredSocial = collectionData?.websiteUrl)}
						on:mouseleave={() => (hoveredSocial = '')}
						class="w-8 h-8 2xl:w-9 2xl:h-9 hover:border-gradient border border-white flex items-center justify-center transition-btn"
					>
						<Web gradient={hoveredSocial === collectionData?.websiteUrl} />
					</a>
				</div>
				<div class:hidden={!collectionData?.deviantartUrl} class="flex flex-col items-center gap-y-1 2xl:gap-y-1.5 font-semibold text-[10px] 2xl:text-sm">
					<p class:hidden={hoveredSocial !== collectionData?.deviantartUrl}>DeviantArt</p>
					<a
						href={collectionData?.deviantartUrl}
						target="_blank"
						on:mouseenter={() => (hoveredSocial = collectionData?.deviantartUrl)}
						on:mouseleave={() => (hoveredSocial = '')}
						class="w-8 h-8 2xl:w-9 2xl:h-9 hover:border-gradient border border-white flex items-center justify-center transition-btn"
					>
						<Deviantart gradient={hoveredSocial === collectionData?.deviantartUrl} />
					</a>
				</div>
				<div class:hidden={!collectionData?.artstationUrl} class="flex flex-col items-center gap-y-1 2xl:gap-y-1.5 font-semibold text-[10px] 2xl:text-sm">
					<p class:hidden={hoveredSocial !== collectionData?.artstationUrl}>ArtStation</p>
					<a
						href={collectionData?.artstationUrl}
						target="_blank"
						on:mouseenter={() => (hoveredSocial = collectionData?.artstationUrl)}
						on:mouseleave={() => (hoveredSocial = '')}
						class="w-8 h-8 2xl:w-9 2xl:h-9 hover:border-gradient border border-white flex items-center justify-center transition-btn"
					>
						<Artstation gradient={hoveredSocial === collectionData?.artstationUrl} />
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
