<script lang="ts">
	import { goto } from '$app/navigation';
	import GuestUserAvatar from '$icons/guest-user-avatar.svelte';
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import ColumnComponentContainer from '../ColumnComponentContainer.svelte';

	export let props;

	$: if (props?.name?.length > 25) {
		props.name = `${props.name.slice(0, 25)}...`;
	}
</script>

<ColumnComponentContainer on:click={() => goto('/profile/' + props.address)}>
	<div class="min-w-full">
		{#if props}
			<div class=" h-full clickable flex gap-3 items-center min-w-max">
				{#if props.imageUrl}
					<div class="gradient-border-btn-new">
						<div class="bg-cover w-12 h-12 clickable" style="background-image: url({props.imageUrl})" />
					</div>
				{:else}
					<GuestUserAvatar class="w-12 scale-110" />
				{/if}
				<div class="text-white font-medium clickable">{props.name || ''}</div>
			</div>
		{:else}
			<DiamondsLoader />
		{/if}
	</div>
</ColumnComponentContainer>
