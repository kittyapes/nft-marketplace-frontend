<script lang="ts">
	import type { CardOptions } from '$interfaces/ui';
	import BrowseOffersOwner from './components/BrowseOffersOwner.svelte';
	import CreateListing from './components/CreateListing.svelte';
	import 'simplebar';
	import 'simplebar/dist/simplebar.css';

	export let options: CardOptions;
</script>

<div class="overflow-hidden aspect-1">
	<div data-simplebar class="h-full pr-6">
		<div class="h-[350px] overflow-hidden">
			<BrowseOffersOwner {options} />
		</div>

		<div class="mt-4">
			<CreateListing {options} />
		</div>
	</div>
</div>
