<script lang="ts">
	import { goto } from '$app/navigation';
	import Edit from '$icons/edit.svelte';
	import { currentUserAddress } from '$stores/wallet';

	export let title: string;
	export let slug: string;
	export let bannerUrl: string;
	export let logoUrl: string;
	export let ownerAddress: string;

	// Keep this check here to make sure the UI updates if and when the current user changes
	$: showEdit = $currentUserAddress === ownerAddress;
	let hover = false;
</script>

<button
	class="rounded-2xl w-[17rem] h-60 relative hover:scale-105 transition-all border border-color-gray-light"
	on:click={() => goto('/collections/' + slug)}
	on:mouseover={() => (hover = true)}
	on:focus={() => (hover = true)}
	on:mouseout={() => (hover = false)}
	on:blur={() => (hover = false)}
>
	<div class="h-4/5 rounded-t-2xl">
		<img src={bannerUrl} alt="Collection banner." class="w-full h-full object-cover rounded-t-2xl border-b border-color-gray-lightest" />
		{#if showEdit}
			<button
				class="absolute top-4 right-3 rounded-3xl flex gap-2 items-center text-white backdrop-blur-2xl p-1 px-3 clickable"
				class:hidden={!hover}
				on:click|stopPropagation={() => goto('/collections/' + slug + '/edit')}
			>
				<Edit />
				<span>Edit</span>
			</button>
		{/if}
	</div>
	<div class="w-7 h-7 rounded-full absolute mx-auto left-0 right-0 bottom-[15%] grid place-items-center bg-color-gray-light">
		<img src={logoUrl} alt="Collection Logo." class="w-6 h-6 rounded-full object-cover absolute" />
	</div>
	<div class="font-semibold grid place-items-center w-full rounded-b-2xl h-1/5">{title}</div>
</button>
