<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	export let data: { imageUrl: string; imageAlt: string; title: string; subtitle: string }[] = [
		{ imageUrl: 'img/placeholder/carousel_image.png', title: 'Hinata Marketplace', subtitle: 'Platform where you can create, buy and sell nfts' },
		{ imageUrl: 'img/placeholder/carousel_image.png', title: 'Second Hinata message', subtitle: 'This is the second Hinata subtitle.' },
	];

	let currentBlob = data[0];

	function handleButtonClick(index: number) {
		currentBlob = data[index];
	}

	let foo = 0;

	function timerPing() {
		foo += 0.1;
	}

	let interval;

	onMount(() => {
		interval = setInterval(timerPing);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="h-[400px] flex flex-col relative overflow-hidden">
	<img src={currentBlob.imageUrl} alt="" class="flex-grow object-cover min-h-0" />

	<div class="bg-dark-gradient text-white p-3 h-24 flex-shrink-0">
		<div class="text-4xl uppercase text-center text-gradient">{currentBlob.title}</div>
		<div class="text-center mt-2">{currentBlob.subtitle}</div>
	</div>

	<div class="flex gap-3 absolute bottom-24 left-0 px-3 w-full items-center">
		{#each data as _, index}
			<div class="flex-grow flex items-end group cursor-pointer h-6 pb-2">
				<div class="bg-white opacity-50 h-[3px] group-hover:h-4 flex-grow" style="transition: height 0.1s;" on:click={() => handleButtonClick(index)}>
					<div />
				</div>
			</div>
		{/each}
	</div>
</div>
