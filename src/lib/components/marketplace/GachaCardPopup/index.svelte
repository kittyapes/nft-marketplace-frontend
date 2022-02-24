<script lang='ts'>
    import SuccessCheckmark from "$icons/success-checkmark.svelte";
import Button from "$lib/components/Button.svelte";
    import PopupContainer from "../UniversalPopup/PopupContainer.svelte";
    import TabFooter from "../UniversalPopup/TabFooter.svelte";

    export let ethCost = 0.1;
    export let usdCost = 25;
    export let copiesRemaining = 500;
    export let rolledNft = 'The Gatekeeper';

    let inputBid: string;
    let buyButtonDisabled = true;

    let successScreen = false;

    let buttonClick = () => {
        if(inputBid) {   
            if(!isNaN(Number(inputBid))) {
                buyButtonDisabled = false;
                inputBid = `${inputBid} Ξ`;
            }
        }
    }

</script>

{#if !successScreen}
    <PopupContainer size={'small'}>
        <div slot='content' class='flex flex-col gap-10 w-5/6'>
            <h1 class='font-bold text-color-black text-sm text-center'>ROLL FOR THE RAREST OF WAIFU NFTS</h1>
            <TabFooter infoText={[{'TOTAL:': `$${usdCost} | Ξ${ethCost}`}, {'COPIES REMAINING:': copiesRemaining}]}><div slot='bt'></div></TabFooter>
            <div class='w-[95%] grid place-items-center relative place-self-center'>
                <input bind:value={inputBid} class='w-full p-2 rounded-md border border-color-black text-2xl' placeholder=00.00>
                <button class='rounded-md bg-color-black text-white font-semibold text-xl px-12 py-[10px] absolute right-0' on:click={buttonClick} >
                    <div class='w-full h-full'>
                        Ξ
                    </div>
                </button>
            </div>
            <Button gradient rounded stretch disabled={buyButtonDisabled} on:click={() => successScreen = true}><p class='italic font-light text-sm'>ROLL</p></Button>
        </div>
    </PopupContainer>
{:else}
<PopupContainer size={'squished'}>
    <div slot='content' class='flex flex-col gap-2 w-2/3 place-items-center'>
        <SuccessCheckmark></SuccessCheckmark>
        <p class='font-semibold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-color-purple to-color-blue'>Congratulations!</p>
        <p class='text-color-black text-xl text-center'>You rolled <b> {rolledNft} </b>NFT</p>
        <div class="w-72 h-72 grid items-center justify-center">
			<img
				src=''
				class="max-w-full max-h-full shadow-xl rounded-xl"
				alt="card artwork"
			/>
		</div>
        <Button outline rounded stretch>VIEW IN INVENTORY</Button>
    </div>
</PopupContainer>
{/if}
