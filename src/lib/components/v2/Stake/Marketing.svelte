<script>
	import CardWrapper from './CardWrapper.svelte';
	import SectionWrapper from './SectionWrapper.svelte';
</script>

<SectionWrapper split>
	<div class="flex flex-col gap-y-[1vw] w-[28vw]">
		<h1 class="text-gradient font-semibold text-[2.8vw] leading-[2vw]">Earn with HINATA</h1>
		<h3 class="font-semibold text-[1.16vw] leading-[1.4vw]">HINATA helps you earn rewards. It’s neat.</h3>
		<p class="font-normal text-[1vw] leading-[1.4vw]">
			Later on, it’ll be the governance token in Hinata’s future DAO, but you can already benefit from Hinata as an incentive for participating in the Hinata ecosystem.
		</p>
	</div>
	<CardWrapper>
		<h3 class=" text-gradient font-semibold text-[1.4vw] leading-[1.4vw] mb-[1.16vw]">Earn by Staking</h3>
		<div class="font-medium flex flex-col items-start text-[1vw] leading-[1.4vw]">
			<p>100% of Hinata trading fees are redistributed proportionally to Hinata stakers.</p>
			<p class="my-[1vw]">Stake Hinata-LP via this page to earn:</p>
			<ul class="list-disc ml-[1vw]">
				<li class="mb-[0.7vw]">WETH trading fees</li>
				<li>Extra Hinata - LP</li>
			</ul>
		</div>
	</CardWrapper>
</SectionWrapper>
