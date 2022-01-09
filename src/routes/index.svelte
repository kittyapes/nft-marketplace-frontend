<script lang="ts">
	import Button from '$lib/components/Button.svelte';
</script>

<div
	class="
		relative
		max-w-[100vw]
		overflow-hidden bg-cover bg-no-repeat bg-[#194665]
		bg-[url('/img/graphics/home-bg.640.png')] h-[500px] bg-[center_top_-400px]
		sm:bg-[url('/img/graphics/home-bg.768.png')] sm:bg-[length:1280px] sm:h-[760px]
		md:bg-[url('/img/graphics/home-bg.1024.png')]
		lg:bg-[url('/img/graphics/home-bg.1280.png')] lg:bg-[length:1280px] lg:bg-[center_top_-150px]
		xl:bg-[url('/img/graphics/home-bg.1920.png')] xl:bg-[length:1536px] xl:bg-[center_top_-400px]
		2xl:bg-[url('/img/graphics/home-bg.4k.png')] 2xl:bg-cover 2xl:bg-[center_calc(50%+600px)]
		2k:h-[1300px]
		4k:h-[1500px] 4k:bg-[length:calc(max(100vw,4000px))] 4k:bg-[center_calc(50%+1000px)]
	"
>
	<div class="absolute top-1/4 -translate-y-1/4 left-0 w-full grid place-items-center">
		<div class="px-8">
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
