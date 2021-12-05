<script>
	import BlogPostPreview from '$lib/components/blog/BlogPostPreview.svelte';
	import Separator from '$lib/components/Separator.svelte';
	import { blogPosts } from '$stores/blog';
</script>

<main class="container x-auto px-32">
	<h1 class="text-8xl mt-16">BLOG</h1>

	<Separator class="mt-8" />

	{#each $blogPosts as data}
		<BlogPostPreview {data} />

		<Separator />
	{/each}

	<div class="mt-32" />
</main>
