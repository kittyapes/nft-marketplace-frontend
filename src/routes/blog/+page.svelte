<script>
	import BlogPostPreview from '$lib/components/blog/BlogPostPreview.svelte';
	import Separator from '$lib/components/Separator.svelte';
	import { blogPosts } from '$stores/blog';

	$: posts = ($blogPosts.length && $blogPosts) || Array(3).fill(0);
</script>

<main class="font-open-sans container mx-auto max-w-screen-lg px-4">
	<h1 class="text-2xl sm:text-3xl md:text-8xl mt-16 text-white">BLOG</h1>

	<Separator class="mt-8" color="#FFFFFF1E"/>

	{#each posts as data}
		<BlogPostPreview {data} skeleton={!data} />
	{/each}

	<div class="mt-32" />
</main>
