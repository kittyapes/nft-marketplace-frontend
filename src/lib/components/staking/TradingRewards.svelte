<script lang="ts">
	import Help from '$icons/help.svelte';
	import Container from './Container.svelte';

	export let tradingRewards = 5.5;
	export let hoursToCollect = 3;
	export let totalVolume = 15.8;
	export let totalRewards = 20;
	export let nextRewardDate = '12 hours 20 min';

	let tradingRewardsInput = `${tradingRewards} HiNATA ($)`;
</script>

<div class="w-full flex py-8 gap-20">
	<div class="flex flex-col gap-6">
		<div class="font-semibold text-2xl flex flex-col">
			<div>Trading Rewards</div>
		</div>
		<div class="max-w-md">
			Earn trading rewards when you buy or sell any NFT on Hinata. Rewards are calculated and
			distributed once daily.
		</div>
	</div>

	<div class="flex flex-col gap-8 w-2/3">
		<div class="flex justify-between text-lg font-semibold">
			<div>Rewards</div>
			<div>{tradingRewards} HiNATA</div>
		</div>
		<Container>
			<div class="w-full flex flex-col gap-2">
				<div class="self-end flex items-center gap-3">
					<div class="text-lg">What’s this</div>
					<button class="rounded-full btn w-6 h-6">
						<Help />
					</button>
				</div>
				<div class="flex w-full gap-6">
					<input
						class="input border-black w-full font-semibold text-lg"
						readonly
						bind:value={tradingRewardsInput}
					/>
					<button class="btn btn-rounded btn-gradient font-semibold">Collect</button>
				</div>
				<div class="font-semibold">You can collect your rewards every {hoursToCollect} hours.</div>
				<div class="flex flex-col mt-6 gap-2">
					<div class="flex ">
						<div class="text-lg font-semibold">Total Volume:</div>
						<div class="flex-grow" />
						<div class="text-lg">{totalVolume}</div>
					</div>
					<div class="flex">
						<div class="text-lg font-semibold">Total Rewards:</div>
						<div class="flex-grow" />
						<div class=" text-lg">{totalRewards}</div>
					</div>

					<div class="flex">
						<div class="text-lg font-semibold">Next Reward Date:</div>
						<div class="flex-grow" />
						<div class="text-lg">{nextRewardDate}</div>
					</div>
				</div>
			</div>
		</Container>
	</div>
</div>
