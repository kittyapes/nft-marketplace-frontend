<script lang="ts">
	import SuccessCheckmark from '$icons/success-checkmark.svelte';
	import PopupContainer from '../UniversalPopup/PopupContainer.svelte';
	import TabFooter from '../UniversalPopup/TabFooter.svelte';

	export let ethCost = 0.1;
	export let usdCost = 25;
	export let copiesRemaining = 500;
	export let rolledNft = 'The Gatekeeper';

	let inputBid: string;
	let buyButtonDisabled = true;

	let successScreen = false;

	let buttonClick = () => {
		if (inputBid) {
			if (!isNaN(Number(inputBid))) {
				buyButtonDisabled = false;
				inputBid = `${inputBid} Ξ`;
			}
		}
	};
</script>

{#if !successScreen}
	<PopupContainer size={'small'}>
		<div slot="content" class="flex flex-col w-5/6 gap-10">
			<h1 class="text-sm font-bold text-center text-color-black">ROLL FOR THE RAREST OF WAIFU NFTS</h1>
			<TabFooter infoText={[{ 'TOTAL:': `$${usdCost} | Ξ${ethCost}` }, { 'COPIES REMAINING:': copiesRemaining }]}><div slot="bt" /></TabFooter>
			<div class="w-[95%] grid place-items-center relative place-self-center">
				<input bind:value={inputBid} class="w-full p-2 text-2xl border rounded-md border-color-black" placeholder="00.00" />
				<button class="rounded-md bg-color-black text-white font-semibold text-xl px-12 py-[10px] absolute right-0" on:click={buttonClick}>
					<div class="w-full h-full">Ξ</div>
				</button>
			</div>
			<button class="w-full btn btn-gradient btn-rounded" disabled={buyButtonDisabled} on:click={() => (successScreen = true)}><p class="text-sm font-light">ROLL</p></button>
		</div>
	</PopupContainer>
{:else}
	<PopupContainer size={'squished'}>
		<div slot="content" class="flex flex-col w-2/3 gap-2 place-items-center">
			<SuccessCheckmark />
			<p class="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-color-purple to-color-blue">Congratulations!</p>
			<p class="text-xl text-center text-color-black">
				You rolled <b>{rolledNft}</b>
				NFT
			</p>
			<div class="grid items-center justify-center w-72 h-72">
				<img src="" class="max-w-full max-h-full shadow-xl rounded-xl" alt="card artwork" />
			</div>
			<button class="w-full btn btn-outline btn-rounded">VIEW IN INVENTORY</button>
		</div>
	</PopupContainer>
{/if}
