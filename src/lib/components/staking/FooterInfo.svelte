<script lang="ts">
	import Container from './Container.svelte';
</script>

<div class="w-full flex py-14 gap-20">
	<div class="flex flex-col gap-6">
		<div class="gradient-text text-5xl font-semibold">Earn with HINATA</div>
		<div class="font-bold text-xl flex flex-col">
			<div>HINATA helps you earn rewards.</div>
			<div>It's neat.</div>
		</div>
		<div class="max-w-md text-xl">
			Later on, it’ll be the governance token in Hinata’s future DAO, but you can already benefit
			from Hinata as an incentive for participating in the Hinata ecosystem.
		</div>
		<button class="btn btn-rounded btn-gradient font-semibold w-3/4 mt-8">Buy Hinata</button>
	</div>

	<div class="flex flex-col gap-8 w-2/3">
		<Container>
			<div class="w-full flex flex-col gap-5">
				<h1 class="font-bold text-xl">Earn by Staking</h1>
				<div class="text-lg flex flex-col gap-3 ">
					<div>100% of Hinata trading fees are redistributed proportionally to Hinata stakers.</div>
					<div>
						<div>
							Stake Hinata-LP via this page to earn:
							<ul class="list-disc pl-5">
								<li>WETH trading fees</li>
								<li>Extra Hinata - LP</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</Container>
		<Container>
			<div class="w-full flex flex-col gap-5">
				<h1 class="font-bold text-xl">Earn by Trading</h1>
				<div class="text-lg flex flex-col ">
					<div>You earn Hinata LP every time you buy or sell an NFT on Hinata.</div>
					<div>Rewards are calculated and distributed once daily.</div>
					<div>(Private listings excluded)</div>
				</div>
			</div>
		</Container>
	</div>
</div>
