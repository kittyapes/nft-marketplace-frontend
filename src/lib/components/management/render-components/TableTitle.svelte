<script lang="ts">
	import ArrowDown from '$icons/arrow-down.svelte';
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	export let props;

	const dispatch = createEventDispatcher();

	let reverse = false;

	let handleClick = () => {
		if (props.active && reverse) {
			props.active = false;
			reverse = false;
			return;
		} else if (!props.sortBy) return;
		else if (props.active) reverse = !reverse;
		props.active = true;
		dispatch('event', { sortBy: props.sortBy, sortReversed: reverse, id: props.id });
	};
</script>

<div
	class="w-full text-lg text-color-gray-base flex gap-1 items-center h-20 px-4 select-none "
	class:justify-center={props?.centered}
	class:cursor-pointer={props?.sortBy}
	on:click|stopPropagation={handleClick}
>
	<div>{props.title}</div>
	{#if props.active}
		<div class="transition" class:rotate-180={reverse} transition:fade>
			<ArrowDown />
		</div>
	{/if}
</div>
