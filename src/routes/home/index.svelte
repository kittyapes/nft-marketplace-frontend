<script lang="ts">
	import Button from '$lib/components/Button.svelte';
</script>

<div
	class="
		relative
		max-w-[100vw] h-[760px]
		overflow-hidden bg-cover bg-[center_top_-200px] bg-no-repeat bg-[#194665]
		bg-[url('/img/graphics/home-bg.640.png')]
		sm:bg-[url('/img/graphics/home-bg.768.png')]
		md:bg-[url('/img/graphics/home-bg.1024.png')]
		lg:bg-[url('/img/graphics/home-bg.1280.png')]
		xl:bg-[url('/img/graphics/home-bg.1920.png')]
		2xl:bg-[url('/img/graphics/home-bg.4k.png')]
	"
>
	<div class="absolute top-1/4 -translate-y-1/4 left-0 w-full grid place-items-center">
		<div class="container px-8">
			<h1 class="uppercase text-white font-semibold text-7xl">Hinata<br />Marketplace</h1>

			<div class="text-white py-6 px-1 text-lg w-1/2">
				The Hinata platform features curated collections and artists of anime, manga, and all
				variety of illustrated work, including Art Blocks, Bored Ape Yacht Club, and more
			</div>

			<div class="flex gap-x-4 mt-6">
				<Button class="flex flex-col justify-center items-center bg-white font-semibold">
					<span class="inline-block">Markets</span>
					<span class="inline-block">(Coming Soon)</span>
				</Button>

				<Button class="flex flex-col justify-center items-center bg-white font-semibold">
					<span class="inline-block">Create</span>
					<span class="inline-block">(Coming Soon)</span>
				</Button>
			</div>
		</div>
	</div>
</div>
