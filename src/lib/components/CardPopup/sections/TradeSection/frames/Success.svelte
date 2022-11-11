<script>
	import SuccessCheck from '$icons/success-check.svelte';

	export let message = 'Action performed successfully.';
</script>

<div class="flex flex-col justify-center gradient-border-green gap-12 aspect-1">
	<div class="text-center mt-4 text-3xl text-white">{message}</div>
	<div class="flex items-center justify-center gap-8">
		<SuccessCheck />
		<div class="gradient-text-green text-7xl">Success!</div>
	</div>
</div>

<style>
	.gradient-border-green {
		border-image: linear-gradient(90deg, #adff00 0%, #4cef00 51.68%, #59ff9c 101.25%) 1;
		@apply border-solid border-4;
	}

	.gradient-text-green {
		@apply text-transparent;
		background: linear-gradient(90deg, #adff00 0%, #4cef00 51.68%, #59ff9c 101.25%);
		background-clip: text;
	}
</style>
