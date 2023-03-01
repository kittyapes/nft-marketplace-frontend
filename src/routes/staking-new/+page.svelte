<script>
	import ContentClaimVesting from './ContentClaimVesting.svelte';
	import ContentStakeUnstake from './ContentStakeUnstake.svelte';
	import Section from './Section.svelte';
</script>

<main class="text-white max-w-screen-xl mx-auto w-full">
	<div class="px-4">
		<h1 class="text-5xl text-gradient text-center mx-auto mt-40">Claim & Stake</h1>

		<div class="grid grid-cols-2 gap-x-16 mt-24">
			<div>
				<div class="text-gradient text-lg">The Token</div>
				<p class="mt-2">
					Hi is a utility ERC-20 token on the Ethereum network with a current total supply of [read
					token contract]. Use it for discounted platform fees, exclusive mints, and more!
				</p>
			</div>

			<div>
				<div class="text-gradient text-lg">Earn By Staking</div>
				<p class="mt-2">
					Either lock up your tokens in the vault to earn up to 12% APY, or deposit into the
					liquidity provider (LP) pool for even more rewards. 100% of platform fees are used to
					support token liquidity.
				</p>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-x-16">
			<div>
				<div class="text-gradient text-lg">Earn From Activity</div>
				<p class="mt-2">
					You can earn tokens from listing, buying, and or even just owning partner NFTs and having
					a verified account with the the Hinata Marketplace.
				</p>
			</div>
		</div>

		<div class="mt-12 grid gap-y-8 pb-12">
			<Section title="Claim Vesting Rewards">
				<ContentClaimVesting />
			</Section>

			<Section title="Claim Trading Rewards" disabled comingSoon>test</Section>

			<Section title="Stake & Unstake">
				<ContentStakeUnstake />
			</Section>
		</div>
	</div>
</main>
