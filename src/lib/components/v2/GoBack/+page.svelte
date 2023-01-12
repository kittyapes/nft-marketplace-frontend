<script>
	import ChevronLeft from '$icons/chevron-left.svelte';
	import { goBack } from '$utils/navigation';
</script>

<div class="flex flex-col items-start gap-y-7 2xl:gap-y-9">
	<button on:click={goBack} class="flex flex-row items-center gap-3 font-medium text-xs 2xl:text-base leading-4 2xl:leading-5">
		<ChevronLeft class="h-4 w-3" />
		<span>Go back</span>
	</button>
	<div class="w-full h-px bg-white" />
</div>
