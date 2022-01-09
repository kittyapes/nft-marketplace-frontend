<script lang="ts">
	export let variant: 'square' | 'rounded-black' | 'rounded-outline' | 'rounded-shadow' | '' = '';

	export let stretch: boolean = false;
	export let gradient: boolean = false;
	export let uppercase: boolean = true;
	export let outline: boolean = ['rounded-outline'].includes(variant);
	export let rounded: boolean = false;
	export let disabled: boolean = false;
</script>

<button
	class="{variant} {$$props.class} transition-btn"
	class:opacity-50={disabled}
	on:click
	class:stretch
	class:gradient
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

	.square {
		@apply bg-white uppercase font-semibold rounded-none;
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

	.outline {
		@apply border-2 border-color-black rounded-full outline-none;
	}

	.rounded {
		@apply rounded-full;
	}

	.stretch {
		@apply w-full;
	}
</style>
