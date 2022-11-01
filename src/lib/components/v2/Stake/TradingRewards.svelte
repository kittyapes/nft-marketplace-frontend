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
	<div class="w-[28vw]">
		<h2 class="gradient-text text-[1.4vw] leading-[1.4vw] mb-[1.85vw]">Trading rewards</h2>
		<p class="font-medium text-[1.1vw] text-justify tracking">Earn trading rewards when you buy or sell any NFT on Hinata. Rewards are calculated and distributed once daily.</p>
	</div>
	<div>
		<h3 class=" text-left text-[1.4vw] leading-[1.4vw] mb-[1.85vw]">Rewards</h3>
		<CardWrapper class="gap-y-[2.31vw]">
			<div class="flex flex-col gap-y-[1.1vw]">
				<div class="flex items-center justify-between">
					<h3 class="gradient-text text-[1.4vw] leading-[1.4vw]">$HiNATA</h3>
					<div class="h-[1.3vw] w-[1.3vw]">
						<QuestionMarkIcon />
					</div>
				</div>
			</div>
			<div>
				<div class="flex flex-row items-center gap-x-[1vw]">
					<Input class="rounded-none bg-transparent pl-[1vw]" noLeftPadding height="2.9vw"><Eth gradient /></Input>
					<Button dullgradient variant="square" class="h-[2.9vw] w-[11.85vw] btn-gradient-border">Stake</Button>
				</div>
				<p class="mt-[1.1vw] font-medium text-[1.16vw]">You can collect your rewards every X hours.</p>
			</div>
			<div class="flex flex-col gap-y-[1vw] font-medium">
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
