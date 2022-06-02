<script lang="ts">
	import NftDisplay from './NftDisplay.svelte';
	import Popup from '$lib/components/Popup.svelte';
	import type { UniversalPopupOptions } from 'src/interfaces/universalPopupOptions';

	export let size: 'large' | 'squished' | 'small' = 'large';
	export let closeButton = false;

	export let options: UniversalPopupOptions;
</script>

<Popup {closeButton} class="w-full h-full lg:h-[40rem] rounded-none lg:rounded-2xl max-w-5xl mx-auto shadow-xl z-50 flex flex-col md:flex-row overflow-y-scroll md:overflow-y-hidden pt-0" on:close>
	<NftDisplay {options} />
	<!-- Right side of popup -->
	<div class="w-full md:w-1/2 bg-white p-10 flex flex-col h-full relative">
		<slot name="content" />
		<div class="h-px mt-1 bg-color-black bg-opacity-30 w-full" />
	</div>
</Popup>
