<script lang="ts">
	import type { BlogPost } from '$stores/blog';
	import { fadeImageOnLoad } from '$utils/actions/fadeImageOnLoad';
	import { fade } from 'svelte/transition';

	export let data: BlogPost = {} as BlogPost;
	export let skeleton = false;
</script>

<div class="relative h-72">
	{#if !skeleton}
		<a
			class="flex h-full overflow-hidden hover:bg-gray-50 transition duration-100 cursor-pointer"
			href={'/blog/' + data.segment}
			in:fade
		>
			<div class="py-8 flex-shrink-0 h-full">
				<img
					src={data.thumbnail}
					alt=""
					class="object-cover h-full"
					style="aspect-ratio: 420/250;"
					use:fadeImageOnLoad
				/>
			</div>

			<div class="flex flex-col ml-36 py-8 flex-grow">
				<div class="text-4xl uppercase">{data.title}</div>

				<!-- Where do we get this content from? -->
				<p class="mt-8 flex-grow">
					It’s been a while since our last Medium update and we have been working diligently to grow
					our network of creative partners, engage with the wider community on Twitter
				</p>

				<!-- Where do we get the reading time from? -->
				<div class="text-[#1D1D1DB2]">{data.pubDate} ∙ 5 min read</div>
			</div>
		</a>
	{:else}
		<div class="flex h-full overflow-hidden animate-pulse absolute w-full">
			<div class="py-8 flex-shrink-0 h-full">
				<div class="h-full bg-gray-100" style="aspect-ratio: 420/250;" />
			</div>

			<div class="flex flex-col ml-36 py-8 flex-grow">
				<div class="uppercase bg-gray-100 h-12 w-36 rounded" />

				<!-- Where do we get this content from? -->
				<div class="mt-8 text-transparent bg-gray-100 h-48" />

				<div class="mt-8" />

				<!-- Where do we get the reading time from? -->
				<div class="text-transparent bg-gray-100 w-24 h-12" />
			</div>
		</div>
	{/if}
</div>
