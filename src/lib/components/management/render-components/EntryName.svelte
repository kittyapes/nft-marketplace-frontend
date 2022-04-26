<script lang="ts">
	import { goto } from '$app/navigation';
	import ColumnComponentContainer from '../ColumnComponentContainer.svelte';

	export let props;

	$: if (props?.name.length > 25) {
		props.name = `${props.name.slice(0, 25)}...`;
	}
</script>

<ColumnComponentContainer on:click={() => goto('/profile/' + props.address)}>
	<div class=" h-full clickable flex gap-3 items-center min-w-max">
		<div class="bg-cover rounded-full w-12 h-12 clickable" style="background-image: url({props.imageUrl})" />
		<div class="text-color-black font-bold clickable">{props.name}</div>
	</div>
</ColumnComponentContainer>
