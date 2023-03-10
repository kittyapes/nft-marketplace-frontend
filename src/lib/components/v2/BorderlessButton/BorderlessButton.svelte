<script lang="ts">
	export let selected: boolean = false;
</script>

<button on:click class="font-semibold h-12" class:selected>
	<slot />
</button>

<style>
	button {
		background: radial-gradient(
				55.65% 55.65% at 51.68% 130.43%,
				rgba(103, 212, 248, 0.025) 0%,
				rgba(142, 119, 247, 0.025) 100%
			),
			radial-gradient(
				55.22% 148.72% at 98.83% 0%,
				rgba(103, 212, 248, 0.025) 0%,
				rgba(142, 119, 247, 0.025) 100%
			),
			radial-gradient(
				64.35% 166.74% at 8.56% -7.83%,
				rgba(103, 212, 248, 0.025) 0%,
				rgba(142, 119, 247, 0.025) 100%
			),
			linear-gradient(
				180deg,
				rgba(136, 234, 255, 0.1) 0%,
				rgba(133, 141, 247, 0.056) 100%,
				rgba(133, 141, 247, 0.1) 100%
			),
			rgba(0, 0, 0, 0.1);
	}

	button.selected {
		background: linear-gradient(
				10deg,
				rgba(167, 148, 255, 0) 11.15%,
				rgba(167, 148, 255, 0.93) 57.47%,
				rgba(142, 119, 247, 0) 127.41%,
				rgba(142, 119, 247, 0) 127.41%,
				rgba(167, 148, 255, 0) 127.41%
			),
			linear-gradient(0deg, #67d4f8, #67d4f8);
	}
</style>
