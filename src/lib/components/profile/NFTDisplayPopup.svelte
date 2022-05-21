<script lang="ts">
	import { contractPurchaseListing } from '$utils/contracts/listing';
	import { notifyError } from '$utils/toast';
	import { noTryAsync } from 'no-try';
	import type { UniversalPopupOptions } from 'src/interfaces/universalPopupOptions';
	import CardBuyScreen from '../marketplace/UniversalPopup/CardBuyScreen.svelte';
	import InfoTab from '../marketplace/UniversalPopup/InfoTab.svelte';
	import PopupContainer from '../marketplace/UniversalPopup/PopupContainer.svelte';
	import TabFooter from '../marketplace/UniversalPopup/TabFooter.svelte';

	export let options: UniversalPopupOptions;

	let state: 'info-screen' | 'buy-now-screen' = 'info-screen';

	// Buy-now listing type
	$: buyButtontext = {
		'info-screen': `Buy for ${options.price} ${options.paymentTokenTicker}`,
		'buy-now-screen': `Buy`
	}[state];

	$: buyButtonHandler = {
		'info-screen': () => (state = 'buy-now-screen'),
		'buy-now-screen': handleBuy
	}[state];

	let isBuying = false;

	async function handleBuy() {
		isBuying = true;

		const [err, res] = await noTryAsync(() => contractPurchaseListing(options.paymentTokenAddress));

		if (err) {
			console.error(err);
			notifyError('Failed to purchase listing on chain!');
			isBuying = false;
			return;
		}

		isBuying = false;
	}
</script>

<PopupContainer closeButton on:close {options}>
	<div slot="content" class="flex-grow flex flex-col">
		{#if options.listingType === 'sale'}
			{#if state === 'info-screen'}
				<InfoTab data={options} />
			{:else if state === 'buy-now-screen'}
				<CardBuyScreen currencySymbol="ETH" />
			{/if}

			<!-- Spacer -->
			<div class="flex-grow" />

			<!-- Sale -->
			<TabFooter
				buttonText={buyButtontext}
				infoText={[
					['Owners', 'N/A'],
					['Ending in', 'N/A']
				]}
				{buyButtonHandler}
				buyButtonDisabled={isBuying}
			/>
		{/if}
	</div>
</PopupContainer>
