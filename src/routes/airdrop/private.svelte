<script>
	import GridOptionContainer from '$lib/components/airdrop/investors/GridOptionContainer.svelte';
	import GridOptionSplit from '$lib/components/airdrop/investors/GridOptionSplit.svelte';
	import Button from '$lib/components/Button.svelte';
	import HorizontailOptionSwitcher from '$lib/components/HorizontailOptionSwitcher.svelte';

	const splitOptions = [
		{
			title: 'Seed',
			hinataValue: '0',
			nextEscrowUnlock: 'N/A',
			claimTokensValue: '0',
			escrowTokensValue: '0'
		},
		{
			title: 'Private',
			hinataValue: '150,000',
			nextEscrowUnlock: '29D, 4H, 17M',
			claimTokensValue: '14,203',
			escrowTokensValue: '67,172'
		},
		{
			title: 'Public',
			hinataValue: '150,000',
			nextEscrowUnlock: '29D, 4H, 17M',
			claimTokensValue: '14,203',
			escrowTokensValue: '67,172'
		}
	];

	const stakeDurationOptions = [{ label: '3MO' }, { label: '1YR' }, { label: '2YR' }];
</script>

<div class="w-full px-6 min-h-screen">
	<div class="w-full flex justify-center mt-24">
		<img src="/img/logo/airdrop-logo.svg" alt="airdrop logo" />
	</div>

	<div class="w-full text-center mt-9 ">
		<div
			class="text-7xl uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-color-purple to-color-blue"
		>
			Investor portal
		</div>

		<div class="font-bold text-5xl mt-8">Private and public rounds</div>

		<div class="mt-16">
			If your wallet has a balance for the private or public HiNATA rounds you will be able to
			interact with this page
		</div>
	</div>

	<div
		class="w-full max-w-5xl mx-auto mt-16 mb-24 bg-color-black bg-opacity-5 border-2 rounded-2xl border-color-black border-opacity-10"
	>
		<!-- Table header -->
		<div
			class="
				flex items-center
				text-2xl
				border-b-2 border-color-black border-opacity-10
			"
		>
			<div
				class="w-2/5 h-full opacity-80 font-bold text-[#807070]
					border-r-2 border-color-black border-opacity-10
					flex items-center pl-14 pt-12 pb-8"
			>
				Balances
			</div>
			<div
				class="w-3/5 flex-grow opacity-80 text-black text-4xl text-center font-semibold pt-12 pb-8"
			>
				Claim your tokens
			</div>
		</div>

		{#each splitOptions as option}
			<GridOptionSplit {...option} />
		{/each}

		<!-- Wallet staking section -->
		<GridOptionContainer title="Wallet" hinataValue="150,000">
			<div class="grid grid-cols-2 place-items-center gap-x-14">
				<div style="font-weight: 450;" class="w-full pl-4">14,203 HINATA TOKENS</div>
				<Button gradient rounded>Stake</Button>
			</div>

			<div class="flex mt-8 items-center gap-x-14">
				<div class="uppercase font-bold">Lockup period</div>
				<HorizontailOptionSwitcher options={stakeDurationOptions} defaultOptionIndex={1} />
			</div>

			<p class="mt-8">
				Deposit your tokens to the vault to earn governance rewards and become a DAO member
			</p>
		</GridOptionContainer>

		<!-- Vault claim section -->
		<GridOptionContainer title="Vault" hinataValue="14,203">
			<div class="grid grid-cols-2 place-items-center gap-x-14">
				<div style="font-weight: 450;" class="w-full pl-4">19.2938433 WAIFU</div>
				<Button gradient rounded>Claim</Button>
			</div>

			<p class="mt-8">
				Use your governance rewards to create proposals and vote at
				<a href="https://snapshot.org/#/hinatadao.eth" class="font-semibold">
					https://snapshot.org/#/hinatadao.eth
				</a>
				as well as claim exclusive NFTs on
				<a href="https://www.hinata.io/drops" class="font-semibold">
					https://www.hinata.io/drops
				</a>.
				<a href="./private" class="font-bold">READ MORE</a>
			</p>
		</GridOptionContainer>
	</div>
</div>
