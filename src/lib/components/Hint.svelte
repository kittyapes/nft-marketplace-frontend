<div class="absolute bg-white px-12 py-2 rounded-md border-2 w-[600px] text-center">
	<slot />
</div>

<style>
	div::before {
		@apply content-[''] absolute w-8 h-8 bg-white border-2
        left-1/2 -bottom-4
        -translate-x-1/2 rotate-45;
		z-index: -1;
	}

	div::after {
		@apply content-[''] absolute h-2 left-1/2 bottom-[-2px] bg-white rounded-full;

		transform: translateX(-50%);
		width: 2.5rem;
	}
</style>
