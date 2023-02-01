<script lang="ts">
	import type { BlogPost } from '$stores/blog';
	import { fadeImageOnLoad } from '$utils/actions/fadeImageOnLoad';
	import { fade } from 'svelte/transition';

	export let data: BlogPost = {} as BlogPost;
	export let skeleton = false;
</script>

<div class="relative">
	{#if !skeleton}
		<a class="flex flex-col h-full overflow-hidden transition duration-100 cursor-pointer lg:flex-row hover:bg-[#FFFFFF1E] lg:gap-20 bg-card-gradient" href={'/blog/' + data.segment} in:fade>
			<div class="flex-shrink-0 h-full max-w-2xl">
				<img src={data.thumbnail} alt="" class="object-cover h-full" style="aspect-ratio: 420/250;" use:fadeImageOnLoad />
			</div>

			<div class="flex flex-col flex-grow text-white pt-8 lg:py-20 gap-5">
				<div class="text-4xl font-light uppercase line-clamp-2">
					{data.title}
				</div>

				<!-- Where do we get this content from? -->
				<p class="mt-8">It’s been a while since our last Medium update and we have been working diligently to grow our network of creative partners, engage with the wider community on Twitter</p>

				<!-- Where do we get the reading time from? -->
				<div class="text-xs text-white text-opacity-70 lg:py-0 mt-8">{data.pubDate} ∙ 5 min read</div>

				<!-- Read more -->
				<!-- <div class="mt-4 text-lg font-light text-gradient">Read more</div> -->
			</div>
		</a>
	{:else}
		<div class="flex flex-col w-full h-full py-11 overflow-hidden lg:flex-row animate-pulse">
			<div class="flex-shrink-0 h-48 py-4 pr-4 lg:py-8 lg:h-full">
				<div class="h-full bg-gray-100" style="aspect-ratio: 420/250;" />
			</div>

			<div class="flex flex-col flex-grow py-4 lg:ml-16 lg:py-8">
				<div class="h-10 uppercase bg-gray-100 rounded lg:h-12 w-36" />

				<div class="h-48 mt-4 text-transparent bg-gray-100 lg:mt-8" />

				<div class="mt-4 lg:mt-8" />

				<div class="w-24 h-10 text-transparent bg-gray-100 lg:h-12" />
			</div>
		</div>
	{/if}
</div>
