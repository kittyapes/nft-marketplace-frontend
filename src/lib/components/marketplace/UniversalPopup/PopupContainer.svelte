<script lang="ts">
	import NftDisplay from './NftDisplay.svelte';
	import Popup from '$lib/components/Popup.svelte';

	export let size: 'large' | 'squished' | 'small' = 'large';
</script>

{#if size === 'large'}
	<Popup
		class="w-full lg:w-2/3 mx-auto shadow-xl z-50 flex flex-col md:flex-row overflow-y-scroll md:overflow-y-hidden h-[40rem] pt-0"
	>
		<NftDisplay />
		<!-- Right side of popup -->
		<div class="w-full md:w-1/2 bg-white p-9 flex flex-col h-full">
			<slot name="content" />
			<div class="h-px w-full mt-1 bg-color-black bg-opacity-30" />
		</div>
	</Popup>
{:else if size === 'squished'}
	<Popup
		class="w-full lg:w-1/3 mx-auto shadow-xl z-50 flex flex-col md:flex-row overflow-y-scroll md:overflow-y-hidden h-[40rem] pt-0 justify-center place-items-center"
	>
		<slot name="content" />
	</Popup>
{:else if size === 'small'}
	<Popup
		class="w-full lg:w-[35%] mx-auto shadow-xl z-50 flex flex-col md:flex-row overflow-y-scroll md:overflow-y-hidden h-96 pt-0 justify-center place-items-center"
	>
		<slot name="content" />
	</Popup>
{/if}
