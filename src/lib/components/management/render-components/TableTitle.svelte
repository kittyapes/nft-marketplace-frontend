<script lang="ts">
	import ArrowDown from '$icons/arrow-down.svelte';
	export let props;
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let reverse = false;

	let handleClick = () => {
		reverse = !reverse;
		dispatch('event', { sortBy: 'ALPHABETIC', sortReversed: reverse });
	};
</script>

<div class="w-full text-lg text-color-gray-base flex gap-1 items-center h-20 px-4" class:justify-center={props?.centered} class:clickable={props?.sortable} on:click|stopPropagation={handleClick}>
	<div>{props.title}</div>
	{#if props?.sortable}
		<div class="transition" class:rotate-180={reverse}>
			<ArrowDown />
		</div>
	{/if}
</div>
