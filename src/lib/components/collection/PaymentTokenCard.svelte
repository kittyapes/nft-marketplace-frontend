<script lang="ts">
	export let iconUrlOrComponent: string | ConstructorOfATypedSvelteComponent;
	export let symbol: string;
	export let name: string;
</script>

<div class="border border-white flex flex-row items-center gap-x-1.5 rounded-none w-40 2xl:w-52  p-2 cursor-not-allowed">
	<div class="grid place-items-center w-4">
		{#if typeof iconUrlOrComponent === 'string'}
			<img src={iconUrlOrComponent} alt="{symbol} icon." />
		{:else}
			<svelte:component this={iconUrlOrComponent} />
		{/if}
	</div>

	<div class="">
		<div class="font-semibold text-xs 2xl:text-sm leading-4 2xl:leading-5">{symbol}</div>
		<div class="font-medium text-[10px] 2xl:text-xs leading-3 2xl:leading-4 whitespace-nowrap">{name}</div>
	</div>
</div>
