<script lang="ts">
	import { fade } from 'svelte/transition';
	import Button from '$lib/components/Button.svelte';
	import { selectedCard } from '$stores/marketplace';

	export let endingIn: Date = new Date();
	export let nftCost: number = 500;
	export let remainingNfts: number = 225;

	let editionTypes: string = $selectedCard?.types.foreach((t) => editionTypes.concat(t + ', '));
</script>

<div in:fade={{ duration: 300 }} class="h-full flex flex-col justify-between">
	<!-- Information -->
	<div>
		<!-- Creator -->
		<div class="w-full flex gap-x-2 items-center">
			<span class="text-sm text-color-black opacity-70">Creator:</span>

			<img
				alt="face"
				class="w-6 h-6 rounded-full object-fill"
				src="https://images.generated.photos/5Lc44DqxkR5Mhtm9SaQZgi8KBe6f0Lga7HkJAN54sGI/rs:fit:512:512/wm:0.95:sowe:18:18:0.33/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92Ml8w/NTc4MDI3LmpwZw.jpg"
			/>

			<span class="text-color-purple">@{$selectedCard?.artist}</span>
		</div>

		<!-- Edition -->
		<div class="w-full flex gap-x-2 items-center mt-5">
			<span class="text-sm text-color-black opacity-70">Edition:</span>

			<span class="font-semibold">{$selectedCard?.totalSupply} of {$selectedCard?.maxSupply}</span>
		</div>

		<!-- External Link -->
		<div class="w-full flex gap-x-2 items-center mt-5">
			<span class="text-sm text-color-black opacity-70">Edition Type:</span>

			<span class='font-semibold'>{editionTypes}</span>
		</div>

		<!-- Description -->
		<div class="w-full  flex flex-col gap-2 mt-5">
			<span class="text-sm text-color-black opacity-70">Description:</span>

			<span>
				Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia
				consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet
			</span>
		</div>
	</div>

	<!-- Bottom buttons -->
	<div>
		<div class="w-full border-t border-color-black border-opacity-30 flex">
			<div class="w-1/2 border-r border-color-black border-opacity-30 pt-2">
                <div class="text-sm text-color-black opacity-70 ">NFTs remaining</div>
                <div class="text-2xl font-semibold text-color-black">{remainingNfts}</div>
            </div>

            <div class="w-1/2 pt-2 pl-4">
                <div class="text-sm text-color-black opacity-70 ">Ending in</div>
                <div class="text-2xl font-semibold text-color-black">
                    {endingIn.getUTCDate() - 1}D 
					{endingIn.getUTCHours()}H
					{endingIn.getUTCMinutes()}M
                </div>
            </div>
		</div>

		<div class="w-full mt-3 flex flex-row gap-4" on:click>
            <Button gradient rounded stretch>BUY FOR {nftCost} HI</Button>
        </div>
	</div>
</div>
