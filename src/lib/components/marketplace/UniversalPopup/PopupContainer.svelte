<script lang="ts">
	import NftDisplay from './NftDisplay.svelte';
	import Popup from '$lib/components/Popup.svelte';

	export let size: 'large' | 'squished' | 'small' = 'large';
	export let closeButton = false;
</script>

{#if size === 'large'}
	<Popup {closeButton} class="w-full lg:w-2/3 mx-auto shadow-xl z-50 flex flex-col md:flex-row overflow-y-scroll md:overflow-y-hidden h-[40rem] pt-0" on:close>
		<NftDisplay />
		<!-- Right side of popup -->
		<div class="w-full md:w-1/2 bg-white p-10 flex flex-col h-full relative">
			<slot name="content" />
			<div class="h-px mt-1 bg-color-black bg-opacity-30 w-full" />
		</div>
	</Popup>
{:else if size === 'squished'}
	<Popup {closeButton} class="w-full lg:w-1/3 mx-auto shadow-xl z-50 flex flex-col md:flex-row overflow-y-scroll md:overflow-y-hidden h-[40rem] pt-0 justify-center place-items-center" on:close>
		<slot name="content" />
	</Popup>
{:else if size === 'small'}
	<Popup {closeButton} class="w-full lg:w-[35%] mx-auto shadow-xl z-50 flex flex-col md:flex-row overflow-y-scroll md:overflow-y-hidden h-96 pt-0 justify-center place-items-center" on:close>
		<slot name="content" />
	</Popup>
{/if}
