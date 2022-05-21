<script lang="ts">
	import type { UniversalPopupOptions } from 'src/interfaces/universalPopupOptions';

	import InfoTab from '../marketplace/UniversalPopup/InfoTab.svelte';
	import PopupContainer from '../marketplace/UniversalPopup/PopupContainer.svelte';
	import TabFooter from '../marketplace/UniversalPopup/TabFooter.svelte';

	export let options: UniversalPopupOptions;
</script>

<PopupContainer closeButton on:close {options}>
	<div slot="content" class="flex-grow flex flex-col">
		<InfoTab data={options} />

		<!-- Spacer -->
		<div class="flex-grow" />

		<!-- Sale -->
		{#if options.listingType === 'sale'}
			<TabFooter
				buttonText="Buy for {options.price} {options.paymentTokenTicker}"
				infoText={[
					['Owners', 'N/A'],
					['Ending in', 'N/A']
				]}
			/>
		{/if}
	</div>
</PopupContainer>
