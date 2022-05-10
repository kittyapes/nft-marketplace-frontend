<script>
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import LoadedContent from '$lib/components/LoadedContent.svelte';
	import { newDropProperties } from '$stores/create';

	const pathToChecks = {
		'/create/choose-listing-format': () => $newDropProperties.quantity,
		'/create/list': () => $newDropProperties.quantity && $newDropProperties.listingType
	};

	let canDisplayContent = false;

	$: if (browser && $page.url.pathname && !canDisplayContent) {
		const check = pathToChecks[$page.url.pathname] || (() => true);

		if (check()) {
			canDisplayContent = true;
		} else {
			goto('/create');
		}
	}
</script>

<LoadedContent loaded={canDisplayContent}>
	<div class="max-w-screen-xl mx-auto">
		<div class="mx-8">
			<slot />
		</div>
	</div>
</LoadedContent>
