<script lang="ts">
	import { defaultProfileImageUrl } from '$constants';
	import EthV2 from '$icons/eth-v2.svelte';
	import type { OfferModel } from '$interfaces';

	export let data: OfferModel;
	export let isFromCurrentUser: boolean = false;
</script>

<div class="flex gap-4 items-center text-white h-14">
	<img src={data.userProfileImageUrl || defaultProfileImageUrl} class="w-10 h-10" alt="" />
	<div class="w-32">
		{data.username}

		{#if isFromCurrentUser}
			<span class="text-xs ml-2 text-gradient">(You)</span>
		{/if}
	</div>
	<div class="flex-grow flex items-center gap-2">
		{data.amount}
		<EthV2 />
	</div>
	<div class="mr-2">{data.ts}</div>
</div>
