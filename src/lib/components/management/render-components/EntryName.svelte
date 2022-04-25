<script lang="ts">
	import { goto } from '$app/navigation';
	import ColumnComponentContainer from '../ColumnComponentContainer.svelte';

	export let props;

	if (props?.name) {
	}
</script>

<ColumnComponentContainer on:click={() => goto('/profile/' + props.address)}>
	<div class="w-full clickable flex gap-3 items-center">
		<div class="bg-cover rounded-full w-12 h-12 clickable" style="background-image: url({props.imageUrl})" />
		<div class="text-color-black font-bold clickable">{props.name}</div>
	</div>
</ColumnComponentContainer>
