<script lang="ts">
	export let iconComponent: any;
	export let title: string;
	export let disabled: boolean = false;
</script>

<button
	on:click
	on:pointerenter
	on:pointerleave
	class="w-96 h-52 p-1 enabled:cursor-pointer border border-white from-color-purple to-color-blue aspect-w-6 aspect-h-5 flex items-center px-12 gradient-bg enabled:hover:brightness-125 transition duration-100 enabled:active:brightness-50 disabled:brightness-50"
	{disabled}
>
	<div class="flex items-center px-12">
		<div class="font-bold flex-grow text-2xl text-left">{title}</div>
		<svelte:component this={iconComponent} />
	</div>
</button>

<style>
	.gradient-bg {
		background: radial-gradient(55.65% 55.65% at 51.68% 130.43%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			radial-gradient(55.22% 148.72% at 98.83% 0%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			radial-gradient(64.35% 166.74% at 8.56% -7.83%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			linear-gradient(180deg, rgba(136, 234, 255, 0.1) 0%, rgba(133, 141, 247, 0.056) 100%, rgba(133, 141, 247, 0.1) 100%), rgba(0, 0, 0, 0.1);
	}
</style>
