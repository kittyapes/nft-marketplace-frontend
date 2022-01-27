<script>
	import LoaderGlow from '$icons/loader/loader-glow.svelte';
	import LoaderIcon from '$icons/loader/loader-icon.svelte';
</script>

<div class="relative h-full">
	<div class="absolute grid place-items-center w-full h-full">
		<LoaderIcon />
	</div>

	<div class="absolute grid place-items-center w-full h-full animate-pulse">
		<div class="opacity-50">
			<LoaderGlow />
		</div>
	</div>
</div>
