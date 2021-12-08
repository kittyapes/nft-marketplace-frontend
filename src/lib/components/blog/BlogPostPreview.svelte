<script lang="ts">
	import type { BlogPost } from '$stores/blog';
	import { fadeImageOnLoad } from '$utils/actions/fadeImageOnLoad';
	import { fade } from 'svelte/transition';

	export let data: BlogPost = {} as BlogPost;
	export let skeleton = false;
</script>

<div class="relative lg:h-72">
	{#if !skeleton}
		<a
			class="flex flex-col lg:flex-row h-full overflow-hidden hover:bg-gray-100 transition duration-100 cursor-pointer"
			href={'/blog/' + data.segment}
			in:fade
		>
			<div class="py-8 flex-shrink-0 h-full lg:h-72">
				<img
					src={data.thumbnail}
					alt=""
					class="object-cover h-full"
					style="aspect-ratio: 420/250;"
					use:fadeImageOnLoad
				/>
			</div>

			<div class="flex flex-col lg:ml-16 py-8 flex-grow">
				<div class="text-3xl uppercase">{data.title}</div>

				<!-- Where do we get this content from? -->
				<p class="mt-4 flex-grow">
					It’s been a while since our last Medium update and we have been working diligently to grow
					our network of creative partners, engage with the wider community on Twitter
				</p>

				<!-- Where do we get the reading time from? -->
				<div class="text-[#1D1D1DB2]">{data.pubDate} ∙ 5 min read</div>
			</div>
		</a>
	{:else}
		<div class="flex flex-col lg:flex-row h-full overflow-hidden animate-pulse w-full">
			<div class="py-4 lg:py-8 flex-shrink-0 h-48 lg:h-full">
				<div class="h-full bg-gray-100" style="aspect-ratio: 420/250;" />
			</div>

			<div class="flex flex-col lg:ml-16 py-4 lg:py-8 flex-grow">
				<div class="uppercase bg-gray-100 h-10 lg:h-12 w-36 rounded" />

				<div class="mt-4 lg:mt-8 text-transparent bg-gray-100 h-48" />

				<div class="mt-4 lg:mt-8" />

				<div class="text-transparent bg-gray-100 w-24 h-10 lg:h-12" />
			</div>
		</div>
	{/if}
</div>
