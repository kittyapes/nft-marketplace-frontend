<script lang="ts">
	import Button from '$lib/components/Button.svelte';
</script>

<div class="showcase">
	<div class="absolute top-1/4 -translate-y-1/4 left-0 w-full grid place-items-center">
		<div class="container px-8">
			<h1 class="uppercase text-white font-semibold text-7xl">Hinata<br />Marketplace</h1>

			<div class="text-white py-6 px-1 text-lg w-1/2">
				The Hinata platform features curated collections and artists of anime, manga, and all
				variety of illustrated work, including Art Blocks, Bored Ape Yacht Club, and more
			</div>

			<div class="flex gap-x-4 mt-6">
				<Button class="flex flex-col justify-center items-center">
					<span class="inline-block">Markets</span>
					<span class="inline-block">(Coming Soon)</span>
				</Button>
				<Button class="flex flex-col justify-center items-center">
					<span class="inline-block">Create</span>
					<span class="inline-block">(Coming Soon)</span>
				</Button>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.showcase {
		@apply max-w-[100vw] h-screen max-h-[1920px];
		@apply relative overflow-hidden bg-cover bg-center bg-no-repeat;
		background-image: url('/img/graphics/home-bg.png');
		height: calc(100vh - theme('padding.16'));
	}
</style>
