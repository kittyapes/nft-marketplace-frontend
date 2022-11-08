<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';

	// this component will assign ID's by itself so it's better not to include it
	export let data: { id?: number; imageUrl: string; imageAlt?: string; title: string; subtitle: string }[] = [
		{ imageUrl: 'img/placeholder/carousel_image.png', title: 'Hinata Marketplace', subtitle: 'Platform where you can create, buy and sell nfts' },
		{ imageUrl: 'https://picsum.photos/200', title: 'Hinata Marketplace', subtitle: 'Platform where you can create, buy and sell nfts' },
		{ imageUrl: 'https://picsum.photos/200/300', title: 'Hinata Marketplace', subtitle: 'Platform where you can create, buy and sell nfts' },
	];

	$: if (!data[0]?.id) {
		data.map((e, i) => (e.id = i));
	}

	let currentBlob = data[0];
	let currentIndex = 0;
	let animatedImage: HTMLImageElement;

	function handleButtonClick(index: number) {
		currentBlob = data[index];
		clearInterval(interval);
		interval = setInterval(timerPing, 5000);
	}

	async function timerPing() {
		if (currentIndex === data.length - 1) {
			currentBlob = data[0];
			currentIndex = 0;
		} else {
			currentBlob = data[currentIndex++ + 1];
		}
	}

	let interval;

	onMount(() => {
		if (data.length) interval = setInterval(timerPing, 5000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="h-full relative overflow-hidden w-full">
	<div class="h-4/5 max-h-4/5 max-w-full overflow-hidden">
		<img src={currentBlob.imageUrl} bind:this={animatedImage} alt="" class="flex-grow object-cover object-bottom w-full min-h-0 h-full animated-image" />
	</div>

	<div class="bg-dark-gradient text-white p-3 h-24 flex-shrink-0 flex flex-col items-center ">
		<div class="text-4xl uppercase text-center text-gradient">{currentBlob.title}</div>
		<div class="text-center mt-2">{currentBlob.subtitle}</div>
	</div>

	<div class="flex gap-3 absolute bottom-28 left-0 px-3 w-full items-center">
		{#each data as _, index}
			<div class="flex-grow flex items-end group cursor-pointer h-6 pb-2">
				<div class="bg-white bg-opacity-50 h-[3px] group-hover:h-4 flex-grow transition-all" style="transition: height 0.1s;" on:click={() => handleButtonClick(index)}>
					{#if index < currentIndex}
						<div class="w-full bg-white bg-opacity-100 h-full " />
					{:else if index === currentIndex}
						<div class=" bg-white bg-opacity-100 h-full animated-bar" />
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<style type="postcss">
	.animated-image {
		animation: zoom 5s infinite;
	}
	@keyframes zoom {
		from {
			transform: scale(1);
		}
		to {
			transform: scale(1.5);
		}
	}

	.animated-bar {
		animation: fill-bar 5s infinite linear;
	}

	@keyframes fill-bar {
		from {
			width: 0%;
		}
		to {
			width: 100%;
		}
	}
</style>
