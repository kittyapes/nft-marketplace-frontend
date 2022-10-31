<script lang="ts">
	import type { BlogPost } from '$stores/blog';
	import { fadeImageOnLoad } from '$utils/actions/fadeImageOnLoad';
	import { fade } from 'svelte/transition';

	export let data: BlogPost = {} as BlogPost;
	export let skeleton = false;
</script>

<div class="relative font-open-sans">
	{#if !skeleton}
		<a class="flex flex-col h-full py-11 overflow-hidden transition duration-100 cursor-pointer lg:flex-row hover:bg-[#FFFFFF1E]" href={'/blog/' + data.segment} in:fade>
			<div class="flex-shrink-0 h-full lg:h-[250px]">
				<img src={data.thumbnail} alt="" class="h-full object-fit" style="aspect-ratio: 420/250;" use:fadeImageOnLoad />
			</div>

			<div class="flex flex-col flex-grow text-white pt-8 lg:py-0 lg:ml-44">
				<div class="text-4xl font-light uppercase line-clamp-2 italic">
					{data.title}
				</div>

				<!-- Where do we get this content from? -->
				<p class="flex-grow mt-8">
					It’s been a while since our last Medium update and we have been working diligently to grow our network of creative partners, engage with the wider community on Twitter
				</p>

				<!-- Where do we get the reading time from? -->
				<div class="text-xs text-white text-opacity-70 pt-8 lg:py-0">{data.pubDate} ∙ 5 min read</div>

				<!-- Read more -->
				<!-- <div class="mt-4 text-lg font-light text-gradient">Read more</div> -->
			</div>
		</a>
		<hr class="border-[#FFFFFF1E] border" />
	{:else}
		<div class="flex flex-col w-full h-full py-11 overflow-hidden lg:flex-row animate-pulse">
			<div class="flex-shrink-0 h-48 py-4 lg:py-8 lg:h-full">
				<div class="h-full bg-gray-100" style="aspect-ratio: 420/250;" />
			</div>

			<div class="flex flex-col flex-grow py-4 lg:ml-16 lg:py-8">
				<div class="h-10 uppercase bg-gray-100 rounded lg:h-12 w-36" />

				<div class="h-48 mt-4 text-transparent bg-gray-100 lg:mt-8" />

				<div class="mt-4 lg:mt-8" />

				<div class="w-24 h-10 text-transparent bg-gray-100 lg:h-12" />
			</div>
		</div>
		<hr class="border-[#FFFFFF1E] border" />
	{/if}
</div>
