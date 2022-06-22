<script lang="ts">
	export let textColor: string | 'gradient' = 'white';
	export let borderColor: string | 'gradient' = '';
	export let uppercase: boolean = false;
	export let height: string = '3rem';
	export let disabled: boolean = false;
</script>

<button
	class="relative w-full font-semibold rounded-full active:opacity-60 disabled:opacity-50 {$$props.class}"
	style:height
	style:color={textColor}
	class:uppercase
	class:border-gradient={borderColor === 'gradient'}
	on:click
	{disabled}
>
	<!-- This is here so we can position the text/content on top of border-gradient -->
	<div class="absolute top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center">
		<span class:text-gradient={textColor === 'gradient'}>
			<slot />
		</span>
	</div>
</button>

<style>
	.border-gradient {
		@apply bg-gradient-to-r from-color-purple to-color-blue;
		@apply before:bg-white before:left-[2px] before:right-[2px] before:top-[2px] before:bottom-[2px] before:content-[''] before:absolute before:rounded-full;
	}

	.text-gradient {
		@apply bg-gradient-to-r from-color-purple to-color-blue text-transparent bg-clip-text;
	}
</style>
