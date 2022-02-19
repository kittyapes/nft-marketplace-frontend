<script lang='ts'>
    import Bids from "$icons/bids.svelte";
    import { onMount } from "svelte";
    import CardBuyScreen from "../UniversalPopup/CardBuyScreen.svelte";
    import CardMidTab from "../UniversalPopup/CardMidTab.svelte";
    import ContentDisplay from "../UniversalPopup/contentDisplay.svelte";
    import InfoTab from "../UniversalPopup/InfoTab.svelte";
    import PopupContainer from "../UniversalPopup/PopupContainer.svelte";
    import SuccessScreen from "../UniversalPopup/SuccessScreen.svelte";
    import TabFooter from "../UniversalPopup/TabFooter.svelte";

    export let currentBid: number = 3.50;
	export let ethereumUsdRate: number = 2878.62;
	export let endingDate: Date = new Date(2022, 1, 25);
	export let lowestPossibleBid: number = 4.50;

    export let creator: string = 'WAIFUlover69';
    export let edition: string = '1 of 1';
    export let description: string = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde aliquam sequi minus alias ad, odio delectus praesentium ratione facilis vel dignissimos ab repellendus inventore similique exercitationem ut deleniti minima necessitatibus!'
    export let externalLink: string;
    export let editionType: string;

    export let rowInfo: PopupRowInfo[] = Array(20).fill(0).map((_, i) => ({id: i, message: 'Placed a bid for', nickname: 'Mitchell', imageUrl: '', amount: 3.50} as PopupRowInfo))
    

    let header = {info: 'You must bid at least', amount: lowestPossibleBid + ' Ξ ' + '($' + Math.round((lowestPossibleBid*ethereumUsdRate + Number.EPSILON) * 100) / 100 + ')', buttonText: 'ADD BALANCE'}
    let inputBid: number;
    let successScreen = false;
    let buyScreen = false;
    let today = new Date();

	onMount(() => {
		const interval = setInterval(() => {
			today = new Date();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
	
	let endingIn = new Date(Math.abs(endingDate.getTime() - today.getTime()));

	$: {
		today;
		endingIn = new Date(Math.abs(endingDate.getTime() - today.getTime()));
	}

    
</script>

<PopupContainer>
    <ContentDisplay slot='content' bind:buyScreen={buyScreen} bind:successScreen={successScreen}>

        <CardBuyScreen slot='buy-screen' currencySymbol={'Ξ'} {header} bind:inputBid={inputBid}>
            <div slot='button-symbol'>Ξ</div>
        </CardBuyScreen>
        <TabFooter slot='buy-screen-footer' on:click={() => {successScreen = true; buyScreen = false;}}
            buttonText={'PLACE A BID'}
            infoText={[{'Current bid': '$' + currentBid*ethereumUsdRate + ' | ' + currentBid + ' Ξ'}, {'Ending in': endingIn.getDate() - 1 + 'D ' + endingIn.getHours() + 'H ' + endingIn.getMinutes() + 'M'}]}>
        </TabFooter>

        <SuccessScreen slot='success-screen' successMessage={'Nice'}></SuccessScreen>

        <div slot='mid-tab-nav-content' class='flex items-center gap-1 font-bold cursor-pointer'>
            <Bids></Bids>
            BIDS
        </div>

        <InfoTab slot='first-tab' data={{creator, edition, editionType, externalLink: externalLink? externalLink : 'Value', description}}></InfoTab>
        <TabFooter slot='first-tab-footer' on:click={() => {successScreen = false; buyScreen = true;}}
            buttonText={'PLACE A BID'}
            infoText={[{'Current bid': '$' + currentBid*ethereumUsdRate + ' | ' + currentBid + ' Ξ'}, {'Ending in': endingIn.getDate() - 1 + 'D ' + endingIn.getHours() + 'H ' + endingIn.getMinutes() + 'M'}]}>
        </TabFooter>

        <CardMidTab slot='mid-tab' crossOld={true} {rowInfo}></CardMidTab>
        <TabFooter slot='mid-tab-footer' on:click={() => {successScreen = false; buyScreen = true;}}
            buttonText={'PLACE A BID'}
            infoText={[{'Current bid': '$' + currentBid*ethereumUsdRate + ' | ' + currentBid + ' Ξ'}, {'Ending in': endingIn.getDate() - 1 + 'D ' + endingIn.getHours() + 'H ' + endingIn.getMinutes() + 'M'}]}>
        </TabFooter>
        
    </ContentDisplay>
</PopupContainer>