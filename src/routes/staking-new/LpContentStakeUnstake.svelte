<script>
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import DurationSwitcher from './DurationSwitcher.svelte';
	import IconEth from './IconEth.svelte';
	import IconHinataLogo from './IconHinataLogo.svelte';

	let apy = 19.75;
	let rewards = 19.75;
</script>

<div class="grid grid-cols-2 gap-x-16 flex-grow">
	<!-- Graph Switcher -->
	<div class="flex items-center">
		<div class="flex-grow">TVL</div>
		<DurationSwitcher />
	</div>

	<dir class="flex gap-x-4">
		<div>
			APY: <span class="text-gradient">{apy}</span>
		</div>

		<div class="text-gradient">|</div>

		<div>
			Rewards:
			<span class="text-gradient">{rewards}</span>
		</div>
	</dir>

	<!-- Graph -->
	<div class="grid">
		<div class="text-gradient">
			<span class="text-lg">${0}k</span>
			•
			<span class="text-sm">${0} Earned</span>
		</div>

		<div>{'20 Feb 2023 12:00'}</div>

		<div class="bg-gradient-a h-72 mt-4" />

		<div class="bg-gradient-a place-items-center flex px-4 py-2 mt-4">
			<div>Liquidity</div>
			<div class="flex-grow text-center">${123}m</div>
			<div class="text-[#F82487]">{-123}%</div>
		</div>

		<div class="flex mt-4 px-px">
			<div class="flex-grow text-lg">Pool Composition</div>
			<div class="text-lg">
				Total Assets: <span class="text-gradient">${123}m</span>
			</div>
		</div>

		<div class="mt-4">
			<div class="bg-gradient-a grid grid-cols-3 px-4 py-2 gradient-border !border-b-0">
				<div>Token</div>
				<div class="text-center">Amount</div>
				<div class="text-right">Value</div>
			</div>

			<div class="gradient-border">
				<div class="bg-gradient-a grid grid-cols-3 px-4 py-3 backdrop-brightness-[40%]">
					<div class="flex items-center space-x-4">
						<IconHinataLogo />
						<div>Hinata</div>
					</div>
					<div class="text-center">{123}</div>
					<div class="text-right">${123}m</div>
				</div>

				<div class="bg-gradient-a grid grid-cols-3 px-4 py-3">
					<div class="flex items-center space-x-4">
						<IconEth />
						<div>ETH</div>
					</div>
					<div class="text-center">{123}</div>
					<div class="text-right">${123}m</div>
				</div>
			</div>
		</div>
	</div>

	<!-- My Position -->
	<div>
		<div class="bg-gradient-a px-4 py-3">
			<div class="flex text-lg">
				<div class="flex-grow">My Position</div>
				<div>{null}</div>
			</div>

			<!-- Unstaked position -->
			<div class="font-medium mt-4 flex">
				<div class="flex-grow">Unstaked Position</div>
				<div>${null}</div>
			</div>

			<div class="flex mt-1">
				<div class="flex-grow font-thin">{null} Hinata</div>
				<div>${null}</div>
			</div>

			<div class="flex mt-1">
				<div class="flex-grow font-thin">{null} ETH</div>
				<div>${null}</div>
			</div>

			<!-- Staked position -->
			<div class="font-medium mt-4 flex">
				<div class="flex-grow">Unstaked Position</div>
				<div>${null}</div>
			</div>

			<div class="flex mt-1">
				<div class="flex-grow font-thin">{null} Hinata</div>
				<div>${null}</div>
			</div>

			<div class="flex mt-1">
				<div class="flex-grow font-thin">{null} ETH</div>
				<div>${null}</div>
			</div>

			<!-- Rewards -->
			<div class="font-medium mt-4 flex">
				<div class="flex-grow">Rewards</div>
				<div>${null}</div>
			</div>

			<div class="flex mt-1">
				<div class="flex-grow font-thin">{null} Hinata</div>
				<div>${null}</div>
			</div>
		</div>

		<div class="grid gap-2 grid-cols-2 mt-4">
			<PrimaryButton>Withdraw</PrimaryButton>
			<PrimaryButton>Deposit</PrimaryButton>

			<div class="col-span-2">
				<PrimaryButton>Claim</PrimaryButton>
			</div>
		</div>
	</div>
</div>
