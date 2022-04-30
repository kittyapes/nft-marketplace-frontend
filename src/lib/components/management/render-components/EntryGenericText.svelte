<script lang="ts">
	import ColumnComponentContainer from '../ColumnComponentContainer.svelte';

	export let props;
</script>

<ColumnComponentContainer>
	<div class="text-color-black">{props.text}</div>
</ColumnComponentContainer>
