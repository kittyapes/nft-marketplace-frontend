<script lang="ts">
	import ColumnComponentContainer from './ColumnComponentContainer.svelte';

	export let props;
</script>

<ColumnComponentContainer>
	<div class="bg-cover rounded-full w-12 h-12" style="background-image: url({props.imageUrl})" />
	<div class="text-color-black font-bold">{props.name}</div>
</ColumnComponentContainer>
