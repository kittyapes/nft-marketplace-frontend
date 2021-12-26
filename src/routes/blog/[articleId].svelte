<script>
	import { page } from '$app/stores';
	import { blogPosts } from '$stores/blog';

	const { articleId } = $page.params;

	$: articleData = $blogPosts.filter((v) => v.segment === articleId)[0];
</script>

{#if articleData}
	<main class="container py-16 overflow-hidden mb-32">
		<img src={articleData.thumbnail} alt="" class="w-full" />

		<div class="grid grid-cols-2 mt-16 gap-x-16">
			<div>
				<h1 class="uppercase text-4xl">{articleData.title}</h1>
			</div>

			<div id="article-container" class="relative">
				{@html articleData.content}
			</div>
		</div>
	</main>
{/if}

<style>
	#article-container :global(img) {
		transform: translate(calc(-100% - 4rem));
		position: absolute;
	}

	#article-container :global(h4) {
		@apply font-bold text-2xl mt-4 mb-2;
	}

	#article-container :global(a) {
		@apply font-semibold text-blue-500 whitespace-pre-wrap break-words;
	}

	#article-container :global(p) {
		@apply mb-4;
	}
</style>
