<script>
	import CardWrapper from './CardWrapper.svelte';
	import SectionWrapper from './SectionWrapper.svelte';
</script>

<SectionWrapper split>
	<div class="flex flex-col gap-y-4 w-[496px]">
		<h1 class="text-gradient font-semibold text-5xl leading-9">Earn with HINATA</h1>
		<h3 class="font-semibold text-xl leading-6">HINATA helps you earn rewards. It’s neat.</h3>
		<p class="font-normal text-xl leading-6">
			Later on, it’ll be the governance token in Hinata’s future DAO, but you can already benefit from Hinata as an incentive for participating in the Hinata ecosystem.
		</p>
	</div>
	<CardWrapper class="w-1/2">
		<h3 class=" text-gradient font-semibold text-2xl leading-6 mb-5">Earn by Staking</h3>
		<div class="font-medium flex flex-col items-start text-xl leading-6">
			<p>100% of Hinata trading fees are redistributed proportionally to Hinata stakers.</p>
			<p class="my-4">Stake Hinata-LP via this page to earn:</p>
			<ul class="list-disc ml-4">
				<li class="mb-3">WETH trading fees</li>
				<li>Extra Hinata - LP</li>
			</ul>
		</div>
	</CardWrapper>
</SectionWrapper>
