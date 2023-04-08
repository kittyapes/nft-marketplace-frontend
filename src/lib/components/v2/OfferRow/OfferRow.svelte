<script lang="ts">
	import { onHover } from '$actions/onHover';
	import { defaultProfileImageUrl } from '$constants';
	import EthV2 from '$icons/eth-v2.svelte';
	import type { OfferModel } from '$interfaces';
	import { writable } from 'svelte/store';
	import ButtonSmallPrimary from '../ButtonSmallPrimary/ButtonSmallPrimary.svelte';
	import { formatToken } from '$utils/misc/priceUtils';
	import { timeSince } from '$utils';

	export let data: OfferModel;
	export let isFromCurrentUser: boolean = false;
	export let enableHover: boolean;

	const hovered = writable(false);
</script>

<div class="flex gap-4 items-center text-white h-14" use:onHover={hovered}>
	<img src={data.user.thumbnailUrl || defaultProfileImageUrl} class="w-10 h-10" alt="" />
	<div class="w-32">
		{data.user.username}

		{#if isFromCurrentUser}
			<span class="text-xs ml-2 text-gradient">(You)</span>
		{/if}
	</div>

	<div class="flex-grow flex items-center gap-2">
		{formatToken(data.offerPrice, data.paymentTokenAddress)}
		<EthV2 />
	</div>

	<div>
		{#if $hovered && enableHover}
			<ButtonSmallPrimary>Accept</ButtonSmallPrimary>
		{:else}
			<div class="mr-2 text-sm opacity-50">{timeSince(data.createdAt)}</div>
		{/if}
	</div>
</div>
