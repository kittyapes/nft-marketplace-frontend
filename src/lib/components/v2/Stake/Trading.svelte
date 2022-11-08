<script>
	import Button from '$lib/components/Button.svelte';
	import CardWrapper from './CardWrapper.svelte';
	import SectionWrapper from './SectionWrapper.svelte';
</script>

<SectionWrapper split>
	<div class="w-[450px]">
		<Button dullgradient stretch class="h-14 border-gradient">Buy</Button>
	</div>
	<CardWrapper class="w-1/2">
		<h3 class=" text-gradient font-semibold text-2xl leading-6 mb-5">Earn by Trading</h3>
		<p class="font-medium flex flex-col items-start text-xl leading-6 w-[400px]">
			You earn Hinata LP every time you buy or sell an NFT on Hinata. Rewards are calculated and distributed once daily. (Private listings excluded).
		</p>
	</CardWrapper>
</SectionWrapper>
