<script lang="ts">
	import Container from './Container.svelte';
</script>

<div class="w-full flex py-10 gap-20">
	<div class="flex flex-col gap-6">
		<div class="font-semibold text-2xl flex flex-col">
			<div>Trading Rewards</div>
		</div>
		<div class="max-w-md">
			Earn trading rewards when you buy or sell any NFT on Hinata. Rewards are calculated and
			distributed once daily.
		</div>
	</div>

	<div class="flex flex-col gap-8 w-2/3">
		<Container>
			<div class="w-full flex flex-col gap-5" />
		</Container>
	</div>
</div>
