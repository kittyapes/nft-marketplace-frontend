<script lang="ts">
	import { page } from '$app/stores';
	import LoadedContent from '$lib/components/LoadedContent.svelte';
	import { blogPosts } from '$stores/blog';

	const { articleId } = $page.params;

	$: articleData = $blogPosts.filter((v) => v.segment === articleId)[0];

	function fixContent(s: string) {
		return s.replace(/<img.+?>/, '');
	}

	$: fixedContent = articleData && fixContent(articleData?.content);
</script>

<LoadedContent loaded={!!articleData}>
	<main class="container py-16 px-8 overflow-hidden mb-32 mx-auto max-w-screen-lg">
		<img src={articleData?.thumbnail} alt="" class="w-full object-contain" />

		<div class="mt-16 gap-x-16 max-w-prose mx-auto">
			<div>
				<h1 class="uppercase text-4xl italic font-light text-color-black">{articleData?.title}</h1>
			</div>

			<div id="article-container" class="relative mt-8">
				{@html fixedContent}
			</div>
		</div>
	</main>
</LoadedContent>

<style>
	#article-container :global(img) {
		@apply my-8;
	}

	#article-container :global(h4) {
		@apply font-bold text-2xl mt-8 mb-2 uppercase;
	}

	#article-container :global(a) {
		@apply font-semibold text-blue-500 whitespace-pre-wrap break-words;
	}

	#article-container :global(p) {
		@apply mb-4;
	}
</style>
