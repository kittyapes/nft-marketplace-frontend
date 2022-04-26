<script lang="ts">
	import ArrowDown from '$icons/arrow-down.svelte';
	import ColumnComponentContainer from '../ColumnComponentContainer.svelte';

	export let props;

	let open = false;
	let handleClick = () => {
		open = true;
	};
</script>

<ColumnComponentContainer class={props?.color}>
	<div class="clickable">
		<ArrowDown />
		<div on:click={handleClick} class="relative">{props.role}</div>
		{#if open}
			<div class="absolut bg-white shadow-lg" />
		{/if}
	</div>
</ColumnComponentContainer>
