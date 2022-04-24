<script lang="ts">
	import ArrowDown from '$icons/arrow-down.svelte';
	import { onMount } from 'svelte';
	import ColumnComponentContainer from './ColumnComponentContainer.svelte';

	export let props;

	let container: any;

	onMount(() => {
		container.style.color = props.color;
	});
</script>

<ColumnComponentContainer bind:this={container} class="btn">
	<ArrowDown />
	<div>{props.role}</div>
</ColumnComponentContainer>
