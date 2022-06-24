<script lang="ts">
	export let imageUrl: string;
	export let tokenIconComponent: any;
	export let tokenAmount: string;
	export let bidderName: string;
	export let timeAgo: string;
</script>

<div class="flex items-center gap-4">
	<img class="w-10 h-10 rounded-full" src={imageUrl} alt="" />
	<div class="flex-grow">{bidderName}</div>
	<div class="flex items-center flex-grow gap-2">
		<svelte:component this={tokenIconComponent} />
		<div>{tokenAmount}</div>
	</div>
	<div class="opacity-50">{timeAgo}</div>
</div>
