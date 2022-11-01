<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import QuestionMarkIcon from '$icons/question-mark-icon.svelte';
	import Button from '$lib/components/Button.svelte';
	import Input from '../Input/Input.svelte';
	import CardWrapper from './CardWrapper.svelte';
	export let tokenSymbol: string;
	export let value = 5000;
	export let lastCollectedAmount = 369;
	export let earnedToDate = 5600003.55;
	export let collectedToDate = new Date();
</script>

<CardWrapper class="gap-y-[2.31vw]">
	<div class="flex flex-col gap-y-[1.1vw]">
		<div class="flex items-center justify-between">
			<h3 class="gradient-text text-[1.4vw] leading-[1.4vw]">${tokenSymbol}</h3>
			<div class="h-[1.3vw] w-[1.3vw]">
				<QuestionMarkIcon />
			</div>
		</div>
	</div>
	<div class="flex flex-row items-center gap-x-[1vw]">
		<Input class="rounded-none bg-transparent pl-[1vw]" bind:value noLeftPadding height="2.9vw"><Eth gradient /></Input>
		<Button dullgradient variant="square" class="h-[2.9vw] w-[11.85vw] btn-gradient-border">Stake</Button>
	</div>
	<div class="flex flex-col gap-y-[1vw] font-medium">
		<div class="flex flex-row items-center justify-between">
			<h4>Last collected:</h4>
			<h4>{lastCollectedAmount?.toFixed(2) || 0.0}</h4>
		</div>
		<div class="flex flex-row items-center justify-between">
			<h4>Collected to date:</h4>
			<h4>{collectedToDate?.toLocaleDateString()}</h4>
		</div>
		<div class="w-full h-0.5  bg-gradient-to-r from-color-purple to-color-blue" />
		<div class="flex flex-row items-center justify-between">
			<h4>Earned to date:</h4>
			<h4>{earnedToDate?.toFixed(2) || 0.0}</h4>
		</div>
	</div>
</CardWrapper>
