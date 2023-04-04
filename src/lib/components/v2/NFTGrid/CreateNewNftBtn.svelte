<script lang="ts">
	import { goto } from '$app/navigation';
	import { nftDraft } from '$stores/create';

	export let collectionAddress: string;
</script>

<div
	class="custom-dashed-border clickable hover:scale-105 transition-all min-h-[15rem] min-w-[260px] inline-block"
	on:click={() => {
		$nftDraft = {};
		$nftDraft.collectionAddress = collectionAddress;
		goto('/create');
	}}
>
	<button class="btn absolute m-auto inset-0 square bg-card-gradient w-20 h-20">
		<div class="absolute inset-0 gradient-border animate-gradient-border-spin" />
		<div class="text-5xl font-thin z-10 bg-transparent">+</div>
	</button>
	<div class="absolute bottom-[20%] inset-x-0 text-center text-lg">Create a new NFT</div>
</div>

<style lang="postcss">
	.custom-dashed-border {
		background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='white' stroke-width='3' stroke-dasharray='6%2c 14' stroke-dashoffset='3' stroke-linecap='square'/%3e%3c/svg%3e");
	}

	.square:active > .gradient-border {
		@apply border-none animate-none;

		background-image: linear-gradient(
				10deg,
				rgba(167, 148, 255, 0) 11.15%,
				rgba(167, 148, 255, 0.93) 57.47%,
				rgba(142, 119, 247, 0) 127.41%,
				rgba(142, 119, 247, 0) 127.41%,
				rgba(167, 148, 255, 0) 127.41%
			),
			linear-gradient(0deg, #67d4f8, #67d4f8) !important;
	}
</style>
