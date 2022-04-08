<script lang="ts">
	import Eth from '$icons/eth.svelte';

	import Help from '$icons/help.svelte';

	import Container from './Container.svelte';

	export let collectionAmount: number;
	export let lastCollected: number;
	export let collectedToDate: string;
	export let earnedToDate: number;
	export let rewardCurrency: string;

	let rewardsInput = `${collectionAmount}`;
</script>

<Container class="w-full {$$props.class}">
	<div class="w-full flex flex-col gap-2">
		<div class="flex">
			<div class="gradient-text text-2xl font-semibold">${rewardCurrency}</div>
			<div class="flex-grow" />
			<button class="btn self-end flex gap-3">
				<div class="text-lg">What’s this</div>
				<div class="w-6 h-6 rounded-full"><Help /></div>
			</button>
		</div>
		<div class="flex w-full gap-6 relative">
			<div class="absolute left-[1%] top-[0.85rem]">
				<Eth class="w-5 h-5" gradient={true} />
			</div>
			<input class="input border-black w-full font-semibold text-lg px-8" readonly bind:value={rewardsInput} />
			<button class="btn btn-rounded btn-gradient font-semibold w-40">Collect</button>
		</div>
		<div class="flex flex-col mt-6 gap-2">
			<div class="flex ">
				<div class="text-lg">Last collected:</div>
				<div class="flex-grow" />
				<div class="text-lg">{lastCollected}</div>
			</div>
			<div class="flex">
				<div class="text-lg">Collected to date:</div>
				<div class="flex-grow" />
				<div class=" text-lg">{collectedToDate}</div>
			</div>
			<hr class="border-t border-color-gray-base" />
			<div class="flex mt-4">
				<div class="text-lg">Earned to date:</div>
				<div class="flex-grow" />
				<div class="text-lg">{earnedToDate}</div>
			</div>
		</div>
	</div>
</Container>
