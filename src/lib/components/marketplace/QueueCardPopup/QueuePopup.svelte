<script lang='ts'>
    import LongLeftArrow from "$icons/long-left-arrow.svelte";
    import Queue from "$icons/queue.svelte";
    import Button from "$lib/components/Button.svelte";
    import { closePopup, setPopup } from "$utils/popup";
    import { onMount } from "svelte";
    import CardMidTab from "../UniversalPopup/CardMidTab.svelte";
    import ContentDisplay from "../UniversalPopup/contentDisplay.svelte";
    import InfoTab from "../UniversalPopup/InfoTab.svelte";
    import PopupContainer from "../UniversalPopup/PopupContainer.svelte";
    import SuccessScreen from "../UniversalPopup/SuccessScreen.svelte";
    import TabFooter from "../UniversalPopup/TabFooter.svelte";
    import QueueCardRow from "./QueueCardRow.svelte";
    import QueueCountDisplay from "./QueueCountDisplay.svelte";
    import QueueEntryPopup from "./QueueEntryPopup.svelte";

    export let entryReq: number = 50;
    export let queueTotal: number = 5254;
    export let queueCurrent: number = 3241;
    export let queueCutCost: number = 0.5;
    export let userWaifu: number = 55;
    export let endingDate: Date = new Date(2022, 1, 25);
    export let remainingNfts: number = 5;

    export let creator: string = 'WAIFUlover69';
    export let edition: string = '5 of 8';
    export let description: string = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde aliquam sequi minus alias ad, odio delectus praesentium ratione facilis vel dignissimos ab repellendus inventore similique exercitationem ut deleniti minima necessitatibus!'
    export let externalLink: string = 'Value';
    export let editionType: string;

    export let rowInfo: PopupRowInfo[] = Array(20).fill(0).map((_, i) => ({id: i, message: 'Ξ', nickname: 'Mitchell', imageUrl: '', amount: 1.2} as PopupRowInfo))
    
    export let queueEntry = false;

    let infoText: {[key: string]: any}[] = [{'Entry requirements': `${entryReq} WAIFU`}, {'Users in pre-queue': queueTotal}];
    let queueInfoText = infoText;
    let successScreen = false;
    let buyScreen = false;
    let today = new Date();
    let tab: number;
    

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

    $: if(queueEntry)
        {
            infoText = [{'NFTs remainings': remainingNfts}, {'Claim queue is live for': endingIn.getDate() - 1 + 'D ' + endingIn.getHours() + 'H ' + endingIn.getMinutes() + 'M'}];
        }
</script>


<PopupContainer>
    <ContentDisplay slot='content' bind:buyScreen={buyScreen} bind:successScreen={successScreen} bind:tab={tab}>

        <SuccessScreen slot='success-screen' successMessage={'Your have cut the queue!'}></SuccessScreen>

        <button slot='success-screen-back-bt' class='flex items-center gap-2 ml-auto' on:click={() => {successScreen = false; tab = 0;}}>
            <LongLeftArrow/>
            <p class='text-color-black font-semibold text-sm'>GO BACK</p>
        </button>
        
        <div slot='mid-tab-nav-content' class='flex items-center gap-1 font-bold cursor-pointer'>
            <Queue></Queue>
            QUEUE
        </div>

        <InfoTab slot='first-tab' data={{creator, edition, editionType, externalLink: externalLink, description}}></InfoTab>
        <TabFooter slot='first-tab-footer' 
            on:click={() => {
                if (!queueEntry && userWaifu >= entryReq) {
                    closePopup();
                    setPopup(QueueEntryPopup);
                }
            }}
            {infoText} >
            <div slot='bt' class='w-full'>
                {#if queueEntry}
                    <QueueCountDisplay currentVal={queueCurrent} totalVal={queueTotal}></QueueCountDisplay>
                {:else}
                    <button class='btn btn-gradient btn-rounded w-full' disabled={false}>{`ENTER PRE-QUEUE`}</button>
                {/if} 
            </div>
        </TabFooter>

        <CardMidTab slot='mid-tab' crossOld={true} {rowInfo}>
            <div slot='mid-tab-row'>
                <p class='font-bold text-color-gray-base text-right text-xs'>FEE TO CUT QUEUE</p>
                {#each rowInfo as row}
                    <QueueCardRow {row} out={row.id > remainingNfts} ></QueueCardRow>
                {/each}
        </CardMidTab>
        <TabFooter slot='mid-tab-footer' on:click={() => {successScreen = true;}}
            buttonText={`CUT QUEUE FOR ${queueCutCost} Ξ`}
            infoText={queueInfoText} >
        </TabFooter>
    </ContentDisplay>
</PopupContainer>