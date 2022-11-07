<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	// this component will assign ID's by itself so it's better not to include it
	export let data: { id?: number; imageUrl: string; imageAlt?: string; title: string; subtitle: string }[] = [
		{ imageUrl: 'img/placeholder/carousel_image.png', title: 'Hinata Marketplace', subtitle: 'Platform where you can create, buy and sell nfts' },
		{ imageUrl: 'https://picsum.photos/200', title: 'Second Hinata message', subtitle: 'This is the second Hinata subtitle.' },
		{ imageUrl: 'https://picsum.photos/200/300', title: 'Third Hinata message', subtitle: 'This is the second Hinata subtitle.' },
	];

	$: if (!data[0]?.id) {
		data.map((e, i) => (e.id = i));
	}

	let currentBlob = data[0];

	function handleButtonClick(index: number) {
		currentBlob = data[index];
		clearInterval(interval);
		setInterval(timerPing, 5000);
	}

	let refreshAnim = true;

	async function timerPing() {
		console.log('timer:', refreshAnim);

		if (currentBlob.id === data.length - 1) {
			currentBlob = data[0];
		} else {
			currentBlob = data.find((e) => e.id === currentBlob.id + 1);
		}

		refreshAnim = false;
		console.log('timer:', refreshAnim);
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
		<img src={currentBlob.imageUrl} alt="" class="flex-grow object-cover object-bottom w-full min-h-0 h-full transition-all duration-[5000ms]" style={refreshAnim ? '' : 'transform: scale(1.5)'} />
	</div>

	<div class="bg-dark-gradient text-white p-3 h-24 flex-shrink-0 flex flex-col items-center ">
		<div class="text-4xl uppercase text-center text-gradient">{currentBlob.title}</div>
		<div class="text-center mt-2">{currentBlob.subtitle}</div>
	</div>

	<div class="flex gap-3 absolute bottom-32 left-0 px-3 w-full items-center">
		{#each data as _, index}
			<div class="flex-grow flex items-end group cursor-pointer h-6 pb-2">
				<div class="bg-white bg-opacity-50 h-[3px] group-hover:h-4 flex-grow transition-all" style="transition: height 0.1s;" on:click={() => handleButtonClick(index)}>
					{#if index < currentBlob.id}
						<div class="w-full bg-white bg-opacity-100 h-full " />
					{:else if index === currentBlob.id}
						<!-- looks smoother with 4500ms duration of transition, otherwise it should be 5000ms -->
						<div class=" bg-white bg-opacity-100 h-full transition-all duration-[5000ms]" style="width: {refreshAnim ? 0 : 100}%" />
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
