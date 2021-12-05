<script lang="ts">
	import type { BlogPost } from '$stores/blog';

	export let data: BlogPost;
</script>

<a
	class="flex h-72 overflow-hidden hover:bg-gray-50 transition duration-100 cursor-pointer"
	href={data.link}
>
	<div class="py-8 flex-shrink-0 h-full">
		<img src={data.thumbnail} alt="" class="object-cover h-full" style="aspect-ratio: 420/250;" />
	</div>

	<div class="flex flex-col ml-36 py-8 flex-grow">
		<div class="text-4xl uppercase">{data.title}</div>

		<!-- Where do we get this content from? -->
		<p class="mt-8 flex-grow">
			It’s been a while since our last Medium update and we have been working diligently to grow our
			network of creative partners, engage with the wider community on Twitter
		</p>

		<!-- Where do we get the reading time from? -->
		<div class="text-[#1D1D1DB2]">{data.pubDate} ∙ 5 min read</div>
	</div>
</a>
