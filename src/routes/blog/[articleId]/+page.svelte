<script lang="ts">
	import { page } from '$app/stores';
	import { socials } from '$constants/socials';
	import Discord from '$icons/socials/discord.svelte';
	import Facebook from '$icons/socials/facebook.svelte';
	import Instagram from '$icons/socials/instagram.svelte';
	import ShareSocial from '$icons/socials/ShareSocial.svelte';
	import Twitter from '$icons/socials/twitter.svelte';
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
	<main class="container max-w-screen-lg px-8 py-16 mx-auto mb-32 overflow-hidden text-white">
		<img src={articleData?.thumbnail} alt="" class="object-contain w-full" />

		<div class="mt-16 gap-x-16 max-w-screen-lg">
			<div>
				<h1 class="text-4xl font-light uppercase text-white text-center italic">{articleData?.title}</h1>
			</div>

			<div class="flex gap-4 mt-8 mx-auto justify-center">
				<a class="clickable" href={socials.twitter}><Twitter /></a>
				<a class="clickable" href={socials.discord}><Discord /></a>
				<!--<a class="clickable"><Instagram /></a>
				<button class="clickable"><ShareSocial /></button>-->
			</div>

			<div id="article-container" class="relative mt-8">
				{@html fixedContent}
			</div>
		</div>
	</main>
</LoadedContent>

<style lang="postcss">
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
