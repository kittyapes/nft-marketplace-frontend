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

<CardWrapper>
	<div class="flex items-center justify-between mb-5">
		<h3 class="text-gradient text-2xl leading-6">${tokenSymbol}</h3>
		<div class="h-5 w-5">
			<QuestionMarkIcon />
		</div>
	</div>
	<div class="flex flex-row items-center gap-x-5 mb-14">
		<Input class="rounded-none bg-transparent pl-5" bind:value noLeftPadding height="50px"><Eth gradient class="w-3 h-5" /></Input>
		<Button dullgradient variant="square" class="h-12 w-52 border-gradient">Stake</Button>
	</div>
	<div class="flex flex-col gap-y-4 font-medium">
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
