<script lang="ts">
	import Eth from '$icons/eth.svelte';

	import Help from '$icons/help.svelte';

	import Container from './Container.svelte';

	export let collectionAmmount = 5000;
	export let lastCollected = 369;
	export let collectedToDate = '26.2.2022';
	export let earnedToDate = 5600003.55;
	export let rewardCurrency = 'HiNATA';

	let rewardsInput = `${collectionAmmount}`;
</script>

<Container class={$$props.class}>
	<div class="w-full flex flex-col gap-2">
		<div class="flex">
			<div class="gradient-text text-2xl font-semibold">${rewardCurrency}</div>
			<div class="flex-grow" />
			<div class="flex items-center gap-3">
				<div class="text-lg">What’s this</div>
				<button class="rounded-full btn w-6 h-6">
					<Help />
				</button>
			</div>
		</div>
		<div class="flex w-full gap-6 relative">
			<div class="absolute left-[1%] top-[0.85rem]">
				<Eth class="w-5 h-5" gradient={true} />
			</div>
			<input
				class="input border-black w-full font-semibold text-lg px-8"
				readonly
				bind:value={rewardsInput}
			/>
			<button class="btn btn-rounded btn-gradient font-semibold">Collect</button>
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
