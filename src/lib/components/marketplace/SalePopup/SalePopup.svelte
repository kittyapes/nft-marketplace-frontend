<script lang="ts">
	import type { ListingPopupOptions } from '$utils/adapters/adaptListingToPopup';
	import { salePurchase } from '$utils/flows/salePurchase';
	import type { PopupHandler } from '$utils/popup';
	import { parseEther } from 'ethers/lib/utils';
	import CardBuyScreen from '../../marketplace/UniversalPopup/CardBuyScreen.svelte';
	import CloseButtonHeader from '../../marketplace/UniversalPopup/CloseButtonHeader.svelte';
	import GoBackHeader from '../../marketplace/UniversalPopup/GoBackHeader.svelte';
	import InfoTab from '../../marketplace/UniversalPopup/InfoTab.svelte';
	import PopupContainer from '../../marketplace/UniversalPopup/PopupContainer.svelte';
	import SuccessScreen from '../../marketplace/UniversalPopup/SuccessScreen.svelte';
	import TabFooter from '../../marketplace/UniversalPopup/TabFooter.svelte';

	export let options: ListingPopupOptions;
	export let handler: PopupHandler;

	type State = 'info-screen' | 'buy-now-screen' | 'success-screen';
	let stateStack: State[] = ['info-screen'];
	let bought = false;

	$: state = stateStack[stateStack.length - 1];

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

		const price = parseEther(options.price.toString());
		const success = await salePurchase(options.onChainId, price);

		success && (state = 'success-screen') && (bought = true);

		isBuying = false;
	}
</script>

<PopupContainer on:close {options}>
	<div slot="content" class="flex-grow flex flex-col">
		<!-- Header -->
		{#if ['success-screen', 'buy-now-screen'].includes(state)}
			<!-- The slice probably doesn't work, but it works -->
			<GoBackHeader on:go-back={() => (stateStack = stateStack.slice())} />
		{/if}

		{#if state === 'info-screen'}
			<CloseButtonHeader on:close={handler.close} />
		{/if}

		{#if state === 'success-screen'}
			<div class="grid place-items-center h-full">
				<SuccessScreen successMessage="You have purchased a listing!" />
			</div>
		{:else if options.listingType === 'sale'}
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
				buyButtonDisabled={isBuying || bought}
				spin={isBuying}
			/>
		{/if}
	</div>
</PopupContainer>
