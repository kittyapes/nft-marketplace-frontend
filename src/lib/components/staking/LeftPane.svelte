<script lang="ts">
	type Variant = 'convert-your-tokens' | 'earn-your-nfts' | 'swap-your-waifu' | 'claim-your-nfts';

	export let variant: Variant = 'convert-your-tokens';
</script>

<div class=" mb-16 max-w-xl">
	<div>
		<div class="uppercase tracking-widest font-bold text-[#1D1D1D99]">
			step 1 of 2 — Choose your pool
		</div>

		<img src="/img/text/{variant}.svg" alt="Convert your" class="mt-3" />
	</div>
</div>
