<script>
	import BlogPostPreview from '$lib/components/blog/BlogPostPreview.svelte';
	import Separator from '$lib/components/Separator.svelte';
	import { blogPosts } from '$stores/blog';

	$: posts = ($blogPosts.length && $blogPosts) || Array(3).fill(0);
</script>

<main class="container mx-auto max-w-4xl px-4">
	<h1 class="text-2xl sm:text-3xl md:text-8xl mt-16">BLOG</h1>

	<Separator class="mt-8" />

	{#each posts as data}
		<BlogPostPreview {data} skeleton={!data} />

		<Separator class={!data && '!bg-gray-100'} />
	{/each}

	<div class="mt-32" />
</main>
