<script>
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Back from '$icons/back_.svelte';
	import LoadedContent from '$lib/components/LoadedContent.svelte';
	import { newDropProperties } from '$stores/create';
	import { appSigner } from '$stores/wallet';
	import { goBack } from '$utils/navigation';

	const pathToChecks = {
		'/create/create-drop': () => $newDropProperties.quantity,
		'/create/choose-listing-format': () => $newDropProperties.quantity,
		'/create/list': () => $newDropProperties.quantity && $newDropProperties.listingType
	};

	let canDisplayContent = false;

	$: if (browser && $page.path && !canDisplayContent) {
		const check = pathToChecks[$page.path] || (() => true);

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
			<!-- Back button -->
			<button
				class="btn flex items-center space-x-2 uppercase font-semibold mt-16 mb-8 text-sm"
				on:click={goBack}
			>
				<Back />
				<div>Go Back</div>
			</button>

			<slot />
		</div>
	</div>
</LoadedContent>
