<script lang="ts">
	import { goto } from '$app/navigation';
	import GuestUserAvatar from '$icons/guest-user-avatar.svelte';
	import HinataBadge from '$icons/hinata-badge.svelte';
	import ColumnComponentContainer from '../ColumnComponentContainer.svelte';

	export let props;

	$: if (props?.name.length > 25) {
		props.name = `${props.name.slice(0, 25)}...`;
	}
</script>

<ColumnComponentContainer on:click={() => goto('/collections/' + props.slug)}>
	<div class=" h-full clickable flex gap-4 items-center min-w-max">
		{#if props.imageUrl}
		<div class="gradient-border-btn-new">
			<div class="bg-cover w-12 h-12 clickable" style="background-image: url({props.imageUrl})" />
		</div>
		{:else}
			<GuestUserAvatar class="w-12 scale-110" />
		{/if}
		<div class="text-white font-medium clickable">{props.name}</div>
		{#if props.badge}
			<HinataBadge class="w-6 h-6" />
		{/if}
	</div>
</ColumnComponentContainer>
