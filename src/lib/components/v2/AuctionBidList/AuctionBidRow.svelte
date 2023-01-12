<script lang="ts">
	import { toShortDisplayPrice } from '$utils/adapters/cardOptions';

	export let imageUrl: string;
	export let tokenIconComponent: any;
	export let tokenAmount: string;
	export let bidderName: string;
	export let timeAgo: string;
</script>

<div class="grid items-center gap-4" style:grid-template-columns="3rem 10rem 8rem auto">
	<img class="w-10 h-10 rounded-full" src={imageUrl || '/svg/icons/guest-avatar.svg'} alt="" />
	<div class="flex-grow">{bidderName || 'Guest'}</div>
	<div class="flex items-center flex-grow gap-2">
		<svelte:component this={tokenIconComponent} />
		<div>{toShortDisplayPrice(tokenAmount)}</div>
	</div>
	<div class="opacity-50 text-sm">{timeAgo}</div>
</div>
