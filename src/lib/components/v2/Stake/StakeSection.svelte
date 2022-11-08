<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '../Input/Input.svelte';
	import PrimaryButton from '../PrimaryButton/PrimaryButton.svelte';
	import CardWrapper from './CardWrapper.svelte';
	import SectionWrapper from './SectionWrapper.svelte';
	export let token: 'HINATA' | 'HINATA LP' = 'HINATA';
	export let action: 'STAKE' | 'UNSTAKE' = 'STAKE';
	export let hinataWalletBalance = 369;
</script>

<SectionWrapper split>
	<div class="flex flex-col items-start text-white font-semibold">
		<h3 class="text-xl leading-8 mb-16">Choose tokens to stake</h3>
		<div class="w-[343px] flex flex-col gap-y-8">
			<Button
				class="h-12 {token !== 'HINATA' ? 'border-gradient' : ''}"
				variant="square"
				stretch
				gradient={token === 'HINATA'}
				dullgradient={token !== 'HINATA'}
				on:click={() => {
					token = 'HINATA';
				}}
			>
				HINATA
			</Button>
			<Button
				class="h-12 {token !== 'HINATA LP' ? 'border-gradient' : ''}"
				variant="square"
				stretch
				gradient={token === 'HINATA LP'}
				dullgradient={token !== 'HINATA LP'}
				on:click={() => {
					token = 'HINATA LP';
				}}
			>
				HINATA LP
			</Button>
		</div>
		<h2 class="text-gradient text-xl leading-6 mt-9 mb-2.5">HINATA Staking</h2>
		<p class="text-xl leading-5">Stake HINATA | Earn WAIFU</p>
	</div>
	<div class="flex flex-col items-start text-white font-semibold w-1/2">
		<h3 class="text-xl leading-8 mb-8">Your Stake</h3>
		<CardWrapper class="gap-y-8">
			<div class="flex flex-row items-center">
				<Button
					class="h-12 {action === 'STAKE' ? 'border-gradient' : ''}"
					variant="square"
					stretch
					dullgradient
					on:click={() => {
						action = 'STAKE';
					}}
				>
					Stake
				</Button>
				<Button
					class="h-12 {action === 'UNSTAKE' ? 'border-gradient' : ''}"
					variant="square"
					stretch
					dullgradient
					on:click={() => {
						action = 'UNSTAKE';
					}}
				>
					Unstake
				</Button>
			</div>
			<div class="flex flex-row items-center gap-x-5">
				<Input class="rounded-none bg-transparent pl-5" height="50px">Max</Input>
				<Button dullgradient variant="square" class="h-12 w-52 border-gradient">Stake</Button>
			</div>
			<div class="flex flex-col gap-y-1.5">
				<h3 class="text-xl leading-6">
					<span class="text-gradient">$HiNATA Wallet Balance:</span>
					{hinataWalletBalance?.toFixed(2) || 0.0}
				</h3>
				<p class="text-xl leading-5">Your Stake (compounding)</p>
			</div>
		</CardWrapper>
	</div>
</SectionWrapper>
