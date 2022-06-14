<script lang="ts">
	import { goto } from '$app/navigation';
	import Edit from '$icons/edit.svelte';

	export let title: string;
	export let slug: string;
	export let bannerUrl: string;
	export let logoUrl: string;

	let hover = false;
	let cardClickAnimation = true;
</script>

<button
	class="rounded-2xl w-[17rem] h-60 relative"
	class:clickable={cardClickAnimation}
	on:click={() => goto('/collections/' + slug)}
	on:mouseover={() => (hover = true)}
	on:focus={() => (hover = true)}
	on:mouseout={() => (hover = false)}
	on:blur={() => (hover = false)}
>
	<div class="h-4/5 rounded-t-2xl">
		<img src={bannerUrl} alt="Collection banner." class="w-full h-full object-cover rounded-t-2xl" />
		<button
			class="absolute top-4 right-3 rounded-3xl flex gap-2 items-center text-white backdrop-blur-2xl p-1 px-3 clickable"
			class:hidden={!hover}
			on:click|stopPropagation={() => goto('/collections/' + slug + '/edit')}
			on:mouseover={() => (cardClickAnimation = false)}
			on:focus={() => (cardClickAnimation = false)}
			on:mouseout={() => (cardClickAnimation = true)}
			on:blur={() => (cardClickAnimation = true)}
		>
			<Edit />
			<span>Edit</span>
		</button>
	</div>
	<div class="bg-white w-[1.75rem] h-[1.75rem] rounded-full absolute mx-auto left-0 right-0 bottom-[15%] grid place-items-center">
		<img src={logoUrl} alt="Collection Logo." class="w-6 h-6 rounded-full object-cover absolute" />
	</div>
	<div class="font-semibold grid place-items-center border-b border-x border-color-gray-light w-full rounded-b-2xl h-1/5">{title}</div>
</button>
