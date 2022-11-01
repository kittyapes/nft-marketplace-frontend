<script lang="ts">
	export let variant: 'square' | 'rounded-black' | 'rounded-outline' | 'rounded-shadow' | '' = '';

	export let stretch: boolean = false;
	export let gradient: boolean = false;
	export let dullgradient: boolean = false;
	export let uppercase: boolean = true;
	export let outline: boolean = ['rounded-outline'].includes(variant);
	export let rounded: boolean = false;
	export let disabled: boolean = false;
</script>

<button
	class="{variant} {$$props.class} flex items-center justify-center transition-btn"
	class:opacity-50={disabled}
	on:click
	class:stretch
	class:gradient
	class:dullgradient
	class:uppercase
	class:outline
	class:rounded
	{disabled}
>
	<slot />
</button>

<style lang="postcss">
	button {
		width: var(--width, 220px);
		padding-top: var(--py, 1rem);
		padding-bottom: var(--py, 1rem);
		padding-left: var(--px, 2rem);
		padding-right: var(--px, 2rem);
	}

	/* Variants */
	.square {
		@apply bg-white uppercase font-semibold px-8 py-4;
		border-radius: 0;
	}

	.rounded-black {
		@apply bg-color-black uppercase font-semibold text-white rounded-full;
	}

	.rounded-shadow {
		@apply bg-white uppercase font-semibold text-color-black rounded-full;
		box-shadow: 0px 2px 10px rgba(122, 122, 122, 0.2);
	}

	.gradient {
		@apply bg-gradient-to-r from-color-purple to-color-blue text-white;
	}
	.dullgradient {
		@apply text-white;
		background: radial-gradient(55.65% 55.65% at 51.68% 130.43%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			radial-gradient(55.22% 148.72% at 98.83% 0%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			radial-gradient(64.35% 166.74% at 8.56% -7.83%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			linear-gradient(180deg, rgba(136, 234, 255, 0.1) 0%, rgba(133, 141, 247, 0.056) 100%, rgba(133, 141, 247, 0.1) 100%), rgba(0, 0, 0, 0.1);
	}
	.outline {
		@apply border-2 border-color-black rounded-full outline-none;
	}
	.gradientborder {
		/* TODO add linear border gradient */
		@apply border-2 border-solid;
	}
	.rounded {
		@apply rounded-full;
	}

	.stretch {
		@apply w-full;
	}
</style>
