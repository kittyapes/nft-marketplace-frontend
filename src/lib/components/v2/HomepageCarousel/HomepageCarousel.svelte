<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	export let data: { imageUrl: string; imageAlt?: string; title: string; subtitle: string }[] = [
		{ imageUrl: 'img/placeholder/carousel_image.png', title: 'Hinata Marketplace', subtitle: 'Platform where you can create, buy and sell nfts' },
		{ imageUrl: 'img/png/airdrop-banner.png', title: 'Hinata Marketplace', subtitle: 'Platform where you can create, buy and sell nfts' },
		{ imageUrl: 'img/placeholder/latest-drop.png', title: 'Hinata Marketplace', subtitle: 'Platform where you can create, buy and sell nfts' },
	];

	let currentBlob = data[0];
	let currentIndex = 0;

	let animatedImage: HTMLImageElement;
	let animatedBar: HTMLDivElement;

	let interval;

	function reset_animation() {
		animatedImage.style.animation = 'none';
		animatedImage.offsetHeight; /* trigger reflow */
		animatedImage.style.animation = null;

		animatedBar.style.animation = 'none';
		animatedBar.offsetHeight; /* trigger reflow */
		animatedBar.style.animation = null;
	}

	function handleButtonClick(index: number) {
		currentBlob = data[index];
		currentIndex = index;

		clearInterval(interval);
		interval = setInterval(timerPing, 5000);

		reset_animation();
	}

	$: if (animatedImage) animatedImage.style.animationPlayState = 'running';
	$: if (animatedBar) animatedBar.style.animationPlayState = 'running';

	async function timerPing() {
		if (currentIndex === data.length - 1) {
			currentBlob = data[0];
			currentIndex = 0;
		} else {
			currentBlob = data[++currentIndex];
		}
	}

	onMount(() => {
		if (data.length) interval = setInterval(timerPing, 5000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="relative overflow-hidden w-full wrapper h-full flex flex-col">
	<div class="absolute inset-0 gradient-border animate-gradient-border-spin z-[5]" />
	<div class="overflow-hidden h-full w-full bg-dark-gradient relative">
		<div class="w-full h-full flex items-start justify-center overflow-hidden relative">
			<img src={currentBlob.imageUrl} bind:this={animatedImage} alt="" class="absolute h-full object-cover object-top w-full animated-image" />
		</div>

		<div class="flex gap-3 absolute bottom-0 left-0 px-3 w-full items-center z-[6]">
			{#each data as _, index}
				<div class="flex-grow flex items-end group cursor-pointer h-6 pb-2">
					<div class="bg-white bg-opacity-50 h-[3px] group-hover:h-4 flex-grow transition-all" style="transition: height 0.1s;" on:click={() => handleButtonClick(index)}>
						{#if index < currentIndex}
							<div class="w-full bg-white bg-opacity-100 h-full " />
						{:else if index === currentIndex}
							<div bind:this={animatedBar} class=" bg-white bg-opacity-100 h-full animated-bar" />
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="bg-dark-gradient text-white flex flex-col items-center justify-center gap-1 flex-grow h-[200px] px-4">
		<div class="text-2xl xl:text-4xl 2xl:text-5xl uppercase text-center text-gradient">{currentBlob.title}</div>
		<div class="text-center 2xl:mt-2 text-base xl:text-xl 2xl:text-2xl">{currentBlob.subtitle}</div>
	</div>
</div>

<style type="postcss">
	.animated-image {
		animation: zoom 5s infinite linear, crossfade 5s infinite linear;
		animation-play-state: paused;
	}
	@keyframes zoom {
		from {
			transform: scale(1);
		}
		to {
			transform: scale(1.25);
		}
	}

	@keyframes crossfade {
		0% {
			opacity: 0;
		}

		5% {
			opacity: 1;
		}

		95% {
			opacity: 1;
		}

		100% {
			opacity: 0;
		}
	}

	.animated-bar {
		animation: fill-bar 5s infinite linear;
		animation-play-state: paused;
	}

	.wrapper:not(:hover) > .gradient-border {
		display: none;
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
