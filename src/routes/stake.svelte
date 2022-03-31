<script lang="ts">
	import LoadedContent from '$lib/components/LoadedContent.svelte';
	import FooterInfo from '$lib/components/staking/FooterInfo.svelte';
	import { walletRefreshed } from '$utils/wallet';
</script>

<LoadedContent loaded={$walletRefreshed}>
	<div class="w-full grid place-items-center">
		<div class="p-10 w-5/6 h-full">
			<hr class="border-b border-color-gray-base border-opacity-50" />
			<FooterInfo />
		</div>
	</div>
</LoadedContent>
