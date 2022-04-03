<script lang="ts">
	import Help from '$icons/help.svelte';
	import Container from './Container.svelte';

	export let rewards: number;
	export let hoursToCollect: number;
	export let totalVolume: number;
	export let totalRewards: number;
	export let nextRewardDate: string;

	let tradingRewardsInput = `${rewards} HiNATA ($)`;
</script>

<div class="w-full grid grid-cols-[2fr_3fr] py-8 gap-20">
	<div class="flex flex-col gap-6">
		<div class="font-semibold text-2xl flex flex-col">
			<div>Trading Rewards</div>
		</div>
		<div class="max-w-md">
			Earn trading rewards when you buy or sell any NFT on Hinata. Rewards are calculated and
			distributed once daily.
		</div>
	</div>

	<div class="flex flex-col gap-8">
		<div class="flex justify-between text-lg font-semibold px-8">
			<div>Rewards</div>
			<div>{rewards} HiNATA</div>
		</div>
		<Container>
			<div class="w-full flex flex-col gap-2">
				<button class="btn self-end flex gap-3">
					<div class="text-lg">What’s this</div>
					<div class="w-6 h-6 rounded-full"><Help /></div>
				</button>
				<div class="flex w-full gap-6">
					<input
						class="input border-black w-full font-semibold text-lg"
						readonly
						bind:value={tradingRewardsInput}
					/>
					<button class="btn btn-rounded btn-gradient font-semibold w-40">Collect</button>
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
