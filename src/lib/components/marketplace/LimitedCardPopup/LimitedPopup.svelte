<script lang="ts">
	import Claims from '$icons/claims.svelte';
	import HinataLogo from '$icons/hinata-logo.svelte';
	import { onMount } from 'svelte';
	import CardBuyScreen from '../UniversalPopup/CardBuyScreen.svelte';
	import CardMidTab from '../UniversalPopup/CardMidTab.svelte';
	import ContentDisplay from '../UniversalPopup/ContentDisplay.svelte';
	import InfoTab from '../UniversalPopup/InfoTab.svelte';
	import PopupContainer from '../UniversalPopup/PopupContainer.svelte';
	import SuccessScreen from '../UniversalPopup/SuccessScreen.svelte';
	import TabFooter from '../UniversalPopup/TabFooter.svelte';

	export let endingDate = new Date(2022, 2, 1);
	export let claimed = 20;
	export let remainingNfts: number = 225;
	export let nftCost = 500;

	export let creator: string = 'WAIFUlover69';
	export let edition: string = '18 of 35';
	export let description: string =
		'Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde aliquam sequi minus alias ad, odio delectus praesentium ratione facilis vel dignissimos ab repellendus inventore similique exercitationem ut deleniti minima necessitatibus!';
	export let externalLink: string;
	export let editionType: string = 'Limited time, limited mint, free';

	export let rowInfo: PopupRowInfo[] = Array(20)
		.fill(0)
		.map(
			(_, i) =>
				({
					id: i,
					message: '35 min',
					nickname: 'Philip',
					imageUrl: '',
					amount: undefined
				} as PopupRowInfo)
		);

	let inputBid: string;
	let successScreen = false;
	let buyScreen = false;
	let buyButtonDisabled = true;
	let today = new Date();

	onMount(() => {
		const interval = setInterval(() => {
			today = new Date();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});

	let buttonClick = () => {
		if (inputBid) {
			if (!isNaN(Number(inputBid)) && Number(inputBid) != 0) {
				buyButtonDisabled = false;
				inputBid = `${inputBid} Hi`;
			}
		}
	};

	let endingIn = new Date(Math.abs(endingDate.getTime() - today.getTime()));

	$: {
		today;
		endingIn = new Date(Math.abs(endingDate.getTime() - today.getTime()));
	}
</script>

<PopupContainer>
	<ContentDisplay slot="content" bind:buyScreen bind:successScreen>
		<CardBuyScreen slot="buy-screen" currencySymbol={'Hi'}>
			<div class="w-[95%] grid place-items-center relative" slot="buy-input">
				<input
					bind:value={inputBid}
					class="w-full p-2 rounded-md border border-color-black text-2xl"
					placeholder="00.00"
				/>
				<button
					class="rounded-md bg-color-black text-white font-semibold text-xl px-[12%] absolute right-0 top-0 bottom-0"
					on:click={buttonClick}
				>
					<div class="w-full">
						<HinataLogo />
					</div>
				</button>
			</div>
		</CardBuyScreen>
		<TabFooter
			slot="buy-screen-footer"
			on:click={() => {
				successScreen = true;
				buyScreen = false;
			}}
			buttonText={'BUY'}
			infoText={[{ 'NFT Remaining': remainingNfts }, { Claimed: claimed }]}
			{buyButtonDisabled}
		/>

		<SuccessScreen slot="success-screen" successMessage={'Your have claimed your limited NFT'} />

		<div slot="mid-tab-nav-content" class="flex items-center gap-1 font-bold cursor-pointer">
			<Claims />
			CLAIMS
		</div>

		<InfoTab
			slot="first-tab"
			data={{ creator, edition, editionType, externalLink: externalLink, description }}
		/>
		<TabFooter
			slot="first-tab-footer"
			on:click={() => {
				successScreen = false;
				buyScreen = true;
			}}
			buttonText={`BUY FOR ${nftCost} Hi`}
			infoText={[
				{ 'NFT Remaining': remainingNfts },
				{
					'Ending in':
						endingIn.getDate() - 1 + 'D ' + endingIn.getHours() + 'H ' + endingIn.getMinutes() + 'M'
				}
			]}
		/>

		<CardMidTab slot="mid-tab" crossOld={false} {rowInfo} bold={true} />
		<TabFooter
			slot="mid-tab-footer"
			on:click={() => {
				successScreen = false;
				buyScreen = true;
			}}
			buttonText={`BUY FOR ${nftCost} Hi`}
			infoText={[
				{ Owners: rowInfo.length },
				{
					'Ending in':
						endingIn.getDate() - 1 + 'D ' + endingIn.getHours() + 'H ' + endingIn.getMinutes() + 'M'
				}
			]}
		/>
	</ContentDisplay>
</PopupContainer>
