<script lang="ts">
	import ArrowDown from '$icons/arrow-down.svelte';
	import { createEventDispatcher } from 'svelte';

	export let props;

	const dispatch = createEventDispatcher();

	let reverse = false;

	let handleClick = () => {
		if (!props?.sortBy) return;
		reverse = !reverse;
		dispatch('event', { sortBy: props.sortBy, sortReversed: reverse });
	};
</script>

<div
	class="w-full text-lg text-color-gray-base flex gap-1 items-center h-20 px-4 select-none "
	class:justify-center={props?.centered}
	class:cursor-pointer={props?.sortBy}
	on:click|stopPropagation={handleClick}
>
	<div>{props.title}</div>
	{#if props?.sortBy}
		<div class="transition" class:rotate-180={reverse}>
			<ArrowDown />
		</div>
	{/if}
</div>
