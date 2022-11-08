<script>
	import Eth from '$icons/eth.svelte';
	import QuestionMarkIcon from '$icons/question-mark-icon.svelte';
	import Button from '$lib/components/Button.svelte';
	import Input from '../Input/Input.svelte';
	import CardWrapper from './CardWrapper.svelte';
	import SectionWrapper from './SectionWrapper.svelte';

	export let totalVolume = 200;
	export let totalRewards = 369;
	export let nextRewardDate = '12 hours 20 min';
</script>

<SectionWrapper split>
	<div class="w-[498px]">
		<h2 class="font-semibold text-gradient text-2xl leading-2 mb-8">Trading rewards</h2>
		<p class="font-medium text-xl text-justify tracking">Earn trading rewards when you buy or sell any NFT on Hinata. Rewards are calculated and distributed once daily.</p>
	</div>
	<div>
		<h3 class="w-1/2 text-left text-2xl leading-2 mb-8">Rewards</h3>
		<CardWrapper>
			<div class="flex items-center justify-between mb-5">
				<h3 class="text-gradient text-2xl leading-2">$HiNATA</h3>
				<div class="h-5 w-5">
					<QuestionMarkIcon />
				</div>
			</div>
			<div>
				<div class="flex flex-row items-center gap-x-5">
					<Input class="rounded-none bg-transparent pl-5" noLeftPadding height="50px"><Eth gradient class="w-3 h-5" /></Input>
					<Button dullgradient variant="square" class="h-12 w-52 border-gradient">Stake</Button>
				</div>
				<p class="mt-5 mb-7 font-medium text-xl">You can collect your rewards every X hours.</p>
			</div>
			<div class="flex flex-col gap-y-4 font-medium">
				<div class="flex flex-row items-center justify-between">
					<h4>Total Volume:</h4>
					<h4>{totalVolume?.toFixed(2) || 0.0}</h4>
				</div>
				<div class="flex flex-row items-center justify-between">
					<h4>Total Rewards:</h4>
					<h4>{totalRewards?.toFixed(2) || 0.0}</h4>
				</div>
				<div class="flex flex-row items-center justify-between">
					<h4>Next Reward Date:</h4>
					<h4>{nextRewardDate}</h4>
				</div>
			</div>
		</CardWrapper>
	</div>
</SectionWrapper>
