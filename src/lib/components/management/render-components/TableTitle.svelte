<script lang="ts">
	import ArrowDown from '$icons/arrow-down.svelte';
	export let props;
</script>

<div class="w-full text-lg text-color-gray-base flex gap-1 items-center h-20 px-4" class:justify-center={props?.centered} class:clickable={props?.sortable}>
	<div>{props.title}</div>
	{#if props?.sortable}
		<div>
			<ArrowDown />
		</div>
	{/if}
</div>
