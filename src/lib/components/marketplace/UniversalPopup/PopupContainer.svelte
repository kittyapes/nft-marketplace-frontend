<script lang='ts'>
	import { browser } from '$app/env';
	import NftDisplay from './NftDisplay.svelte';
	import Popup from '$lib/components/Popup.svelte';
	import CloseButton from '$icons/close-button.svelte';
	import { closePopup } from '$utils/popup';

	export let size: 'large' | 'squished' | 'small' = 'large';
</script>

<div
	class="z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center p-8 lg:p-0"
	class:hidden={!browser}
>
	{#if size === 'large'}
		<Popup class='w-full lg:w-2/3 mx-auto shadow-xl z-50 flex flex-col md:flex-row overflow-y-scroll md:overflow-y-hidden h-[40rem] pt-0'>
			<NftDisplay></NftDisplay>
			<!-- Right side of popup -->
			<div class="w-full md:w-1/2 bg-white p-9 flex flex-col h-full">
				<slot name='content'></slot>
				<div class="h-px w-full mt-1 bg-color-black bg-opacity-30" />
			</div>
		</Popup>
	{:else if size === 'squished'}
		<Popup class='w-full lg:w-1/3 mx-auto shadow-xl z-50 flex flex-col md:flex-row overflow-y-scroll md:overflow-y-hidden h-[40rem] pt-0 justify-center place-items-center'>
			<slot name='content'></slot>
		</Popup>
	{:else if size === 'small'}
		<Popup class='w-full lg:w-[35%] mx-auto shadow-xl z-50 flex flex-col md:flex-row overflow-y-scroll md:overflow-y-hidden h-96 pt-0 justify-center place-items-center'>
			<slot name='content'></slot>
		</Popup>
	{/if}
</div>