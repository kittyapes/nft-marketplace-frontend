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

	$: if (animatedBar) animatedBar.style.animationPlayState = 'running';

	async function timerPing() {
		if (currentIndex === data.length - 1) {
			currentBlob = data[0];
			currentIndex = 0;
		} else {
			currentBlob = data[++currentIndex];
			console.log(currentIndex);
			console.log(currentBlob, data[currentIndex]);
		}
	}

	onMount(() => {
		if (data.length) {
			interval = setInterval(timerPing, 5000);
			animatedImage.style.animationPlayState = 'running';
		}
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="h-full relative overflow-hidden w-full wrapper">
	<div class="h-4/5 max-h-4/5 max-w-full overflow-hidden bg-dark-gradient">
		<img src={currentBlob.imageUrl} bind:this={animatedImage} alt="" class="flex-grow object-cover object-bottom w-full min-h-0 h-full animated-image !bg-black" />
	</div>

	<div class="bg-dark-gradient text-white p-3 h-1/5 flex-shrink-0 flex flex-col items-center ">
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
						<div bind:this={animatedBar} class=" bg-white bg-opacity-100 h-full animated-bar" />
					{/if}
				</div>
			</div>
		{/each}
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

	.wrapper {
		@apply border-transparent border-2;
	}

	.wrapper:hover {
		border-image: linear-gradient(45deg, #868bf7, #6cc7f8) 1;
		@apply border-solid;
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
