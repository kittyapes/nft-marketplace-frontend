<script lang="ts">
	import Entries from '$icons/entries.svelte';
	import { indexOf } from 'lodash-es';
	import { onMount } from 'svelte';
	import CardBuyScreen from '../UniversalPopup/CardBuyScreen.svelte';
	import CardMidTab from '../UniversalPopup/CardMidTab.svelte';
	import ContentDisplay from '../UniversalPopup/ContentDisplay.svelte';
	import InfoTab from '../UniversalPopup/InfoTab.svelte';
	import PopupContainer from '../UniversalPopup/PopupContainer.svelte';
	import SuccessScreen from '../UniversalPopup/SuccessScreen.svelte';
	import TabFooter from '../UniversalPopup/TabFooter.svelte';
	import EntriesTabRow from './EntriesTabRow.svelte';

	export let endingDate = new Date(2022, 2, 1);
	export let userTickets = 0;
	export let currentEntries: number = 200;
	export let ticketPrice: number = 0.7;

	export let creator: string = 'WAIFUlover69';
	export let edition: string = '1 of 3';
	export let description: string =
		'Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde aliquam sequi minus alias ad, odio delectus praesentium ratione facilis vel dignissimos ab repellendus inventore similique exercitationem ut deleniti minima necessitatibus!';
	export let externalLink: string = 'Value';
	export let editionType: string = undefined;

	export let rowInfo: PopupRowInfo[] = Array(20)
		.fill(0)
		.map(
			(_, i) =>
				({ id: i, message: '', nickname: 'Philip', imageUrl: '', amount: 10 } as PopupRowInfo)
		);

	let potentialOdds = '0';
	$: userOdds = `${userTickets} in ${currentEntries}`;

	$: {
		userTickets;
		if (userTickets != 0) {
			let checkForUser = rowInfo.filter((r) => r.nickname === 'User');
			if (checkForUser.length === 0) {
				rowInfo.forEach((r) => r.id++);
				rowInfo.unshift({
					id: 0,
					message: `You have`,
					nickname: 'User',
					imageUrl: '',
					amount: userTickets
				});
			} else {
				rowInfo[indexOf(rowInfo, checkForUser[0])].amount = userTickets;
			}
		}
		rowInfo;
		currentEntries = 0;
		rowInfo.forEach((r) => (currentEntries += r.amount));
	}

	let successMessage = 'You have purchased and entered raffle tickets';
	let claimedFree = false;
	let buyingTicketsAmount: number = 0;
	let inputBid: string;
	$: inputBidValue = Number(inputBid);

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

	$: {
		inputBidValue;
		if (!isNaN(inputBidValue)) {
			buyingTicketsAmount = Math.round(
				(inputBidValue - (inputBidValue % ticketPrice)) / ticketPrice
			);
		}
	}

	let buttonClick = () => {
		if (inputBidValue) {
			if (!isNaN(inputBidValue) && inputBidValue >= ticketPrice) {
				buyButtonDisabled = false;
				inputBid = `${
					Math.round((Number(inputBid) - (Number(inputBid) % ticketPrice) + Number.EPSILON) * 100) /
					100
				} Ξ`;
				inputBidValue = inputBidValue - (inputBidValue % ticketPrice);
				let coef = (currentEntries + buyingTicketsAmount) / 100;
				potentialOdds = `${
					Math.round((buyingTicketsAmount / coef + Number.EPSILON) * 100) / 100
				} in 100`;
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
		<CardBuyScreen slot="buy-screen" currencySymbol={'Ξ'}>
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
					<p>{buyingTicketsAmount}</p>
				</button>
			</div>
			<div slot="header" class="flex gap-4 items-center">
				<p class="text-color-black">{{ info: 'Tickets are automatically entered' }}</p>
			</div>
		</CardBuyScreen>
		<TabFooter
			slot="buy-screen-footer"
			on:click={() => {
				successScreen = true;
				buyScreen = false;
				userTickets += buyingTicketsAmount;
			}}
			buttonText={'BUY'}
			infoText={[
				{ 'Potential odds': potentialOdds },
				{
					'Drawing in':
						endingIn.getDate() - 1 + 'D ' + endingIn.getHours() + 'H ' + endingIn.getMinutes() + 'M'
				}
			]}
			{buyButtonDisabled}
		/>

		<SuccessScreen slot="success-screen" {successMessage} />

		<div slot="mid-tab-nav-content" class="flex items-center gap-1 font-bold cursor-pointer">
			<Entries />
			ENTRIES
		</div>

		<InfoTab
			slot="first-tab"
			data={{ creator, edition, editionType, externalLink: externalLink, description }}
		/>
		<TabFooter
			slot="first-tab-footer"
			on:click={() => {
				if (!claimedFree) {
					claimedFree = true;
					successMessage = 'You have entered raffle';
					successScreen = true;
					buyScreen = false;
					userTickets++;
				}
			}}
			buttonText={`CLAIM FREE TICKET`}
			infoText={[
				{ 'Current entries': currentEntries },
				{
					'Drawing in':
						endingIn.getDate() - 1 + 'D ' + endingIn.getHours() + 'H ' + endingIn.getMinutes() + 'M'
				}
			]}
		/>

		<CardMidTab slot="mid-tab">
			<div slot="mid-tab-row">
				<p class="font-semibold text-color-black text-right mr-4 text-xs">Odds</p>
				{#each rowInfo as row}
					<EntriesTabRow
						{row}
						odds={Math.round((100 / (currentEntries / row.amount) + Number.EPSILON) * 100) / 100}
					/>
				{/each}
			</div>
		</CardMidTab>
		<TabFooter
			slot="mid-tab-footer"
			on:click={() => {
				successMessage = 'You have purchased and entered raffle tickets';
				successScreen = false;
				buyScreen = true;
			}}
			buttonText={`BUY RAFFLE TICKETS`}
			infoText={[{ 'My Odds': userOdds }, { 'My tickets': userTickets }]}
		/>
	</ContentDisplay>
</PopupContainer>
