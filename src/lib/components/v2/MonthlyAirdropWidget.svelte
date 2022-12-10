<script>
    import { slide } from "svelte/transition";
    import Popup from "../Popup.svelte";

    export const airdrop = {
		title: 'Claim your monthly airdrop',
		textPreview:
			'The Hinata marketplace will be doing an airdrop for active users in the coming months. Buyers, sellers and minters will all be eligible to claim tokens after the token generation event later this year.',
		thumbnail: '/img/png/airdrop-banner.png',
	};

	let showAirdropInfo = false;
</script>

<div class="mt-24 mb-16">
    <div class="flex items-end">
        <h2 class="text-4xl leading-none font-semibold text-white uppercase flex-grow">Monthly Airdrop</h2>
    </div>
    <hr class="mt-4 border-[#FFFFFF1E]" />

    <div class="flex flex-col h-full py-11 pr-4 overflow-hidden transition duration-100 cursor-pointer lg:flex-row hover:bg-[#FFFFFF1E]" on:click={() => {
        showAirdropInfo = !showAirdropInfo;
    }}>
        <div class="flex-shrink-0 h-full lg:h-[250px]">
            <img src={airdrop.thumbnail} alt="" class="object-cover h-full" style="aspect-ratio: 420/250;" />
        </div>
        <hr class="mt-4 border-[#0000004D]" />

        <div class="flex flex-col flex-grow text-white pt-8 lg:py-0 lg:ml-44">
            <div class="text-4xl font-light uppercase line-clamp-2 italic">
                {airdrop.title}
            </div>

            <p class="flex-grow mt-8">
                {airdrop.textPreview}
            </p>
        </div>
    </div>
</div>
{#if showAirdropInfo}
    <div class="mb-16" transition:slide>
        <Popup>
            <div class="flex items-center justify-center w-[80vw]">
                <img src={airdrop.thumbnail} alt="airdrop-full" class="w-full">
            </div>
        </Popup>
    </div>
{/if}