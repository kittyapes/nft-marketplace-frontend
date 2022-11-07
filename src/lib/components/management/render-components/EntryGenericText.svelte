<script lang="ts">
	import ColumnComponentContainer from '../ColumnComponentContainer.svelte';

	export let props;
</script>

<ColumnComponentContainer>
	<div class="text-white {props.color}">{props.text}</div>
</ColumnComponentContainer>
