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
		<h3 class="text-[1.4vw] leading-[1.8vw] mb-[3.6vw]">Choose tokens to stake</h3>
		<div class="w-[20vw] flex flex-col gap-y-[2vw]">
			<Button
				class="h-[2.9vw] {token !== 'HINATA' ? 'border-gradient' : ''}"
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
				class="h-[2.9vw] {token !== 'HINATA LP' ? 'border-gradient' : ''}"
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
		<h2 class="text-gradient text-[1.4vw] leading-[1.4vw] mt-[1.5vw] mb-[0.5vw]">HINATA Staking</h2>
		<p class="text-[1vw] leading-[1vw]">Stake HINATA | Earn WAIFU</p>
	</div>
	<div class="flex flex-col items-start text-white font-semibold">
		<h3 class="text-[1.4vw] leading-[1.8vw] mb-[1.86vw]">Your Stake</h3>
		<CardWrapper class="gap-y-[1.75vw]">
			<div class="flex flex-row items-center">
				<Button
					class="h-[2.9vw] {action === 'STAKE' ? 'border-gradient' : ''}"
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
					class="h-[2.9vw] {action === 'UNSTAKE' ? 'border-gradient' : ''}"
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
			<div class="flex flex-row items-center gap-x-[1vw]">
				<Input class="rounded-none bg-transparent pl-[1vw]" height="2.9vw">Max</Input>
				<Button dullgradient variant="square" class="h-[2.9vw] w-[11.85vw] border-gradient">Stake</Button>
			</div>
			<div class="flex flex-col gap-y-[0.3vw]">
				<h3 class="text-[1.4vw] leading-[1.4vw]">
					<span class="text-gradient">$HiNATA Wallet Balance:</span>
					{hinataWalletBalance?.toFixed(2) || 0.0}
				</h3>
				<p class="text-[1.15vw] leading-[1.15vw]">Your Stake (compounding)</p>
			</div>
		</CardWrapper>
	</div>
</SectionWrapper>
