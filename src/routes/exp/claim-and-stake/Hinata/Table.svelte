<div class="gradient-border">
	<div class="--slot-headers">
		<slot name="headers" />
	</div>

	<!-- Separator -->
	<div class="gradient-border col-span-3 !border-b-2 !border-0" />

	<div class="--slot-data">
		<slot name="data" />
	</div>
</div>

<style lang="postcss">
	:global(.--slot-headers > div > div) {
		@apply text-lg h-12 px-4 flex items-center;
	}

	:global(.--slot-headers > div > div:nth-child(3)) {
		@apply pl-24;
	}

	:global(.--slot-headers > div) {
		@apply grid grid-cols-3;

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

	:global(.--slot-data .table_item) {
		@apply grid grid-cols-3 w-full;
	}

	:global(.--slot-data .table_item > div) {
		@apply h-12 flex items-center px-4;
	}

	:global(.--slot-data .table_item > div:nth-child(3n)) {
		@apply pl-24;
	}

	/* :global(.--slot-data > div > div:nth-child(6n + 4)),
	:global(.--slot-data > div > div:nth-child(6n + 5)),
	:global(.--slot-data > div > div:nth-child(6n + 6)) {
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
	} */
</style>
