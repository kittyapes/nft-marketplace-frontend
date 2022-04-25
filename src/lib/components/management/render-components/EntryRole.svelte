<script lang="ts">
	import ArrowDown from '$icons/arrow-down.svelte';
	import ColumnComponentContainer from '../ColumnComponentContainer.svelte';

	export let props;
</script>

<ColumnComponentContainer class={props.color}>
	<div class="clickable">
		<ArrowDown />
		<div>{props.role}</div>
	</div>
</ColumnComponentContainer>
