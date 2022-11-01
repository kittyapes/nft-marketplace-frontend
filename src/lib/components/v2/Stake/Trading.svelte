<script>
	import Button from '$lib/components/Button.svelte';
	import CardWrapper from './CardWrapper.svelte';
	import SectionWrapper from './SectionWrapper.svelte';
</script>

<SectionWrapper split>
	<div class="w-[27.5vw]">
		<Button dullgradient stretch class="h-[3.2vw] border-gradient">Buy</Button>
	</div>
	<CardWrapper class="gap-y-[1.3vw]">
		<h3 class=" gradient-text font-semibold text-[1.4vw] leading-[1.4vw] mb-[1.16vw]">Earn by Trading</h3>
		<p class="font-medium flex flex-col items-start text-[1vw] leading-[1.4vw]  w-[400px]">
			You earn Hinata LP every time you buy or sell an NFT on Hinata. Rewards are calculated and distributed once daily. (Private listings excluded).
		</p>
	</CardWrapper>
</SectionWrapper>
