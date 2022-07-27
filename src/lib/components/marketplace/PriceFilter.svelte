<script lang="ts">
	import { regexFilter } from '$actions/regexFilter';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { listingTokens } from '$utils/contracts/listing';
	import { floatRe } from '$utils/misc/regex';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import Dropdown from '../Dropdown.svelte';

	const dispatch = createEventDispatcher();

	let min: string;
	let max: string;
	let selectedToken: typeof listingTokens[0];

	function updateSearchParams() {
		if ((min && !min.match(floatRe)) || (max && !max.match(floatRe))) {
			return;
		}

		$page.url.searchParams.set('token', selectedToken.label);

		min ? $page.url.searchParams.set('minPrice', min) : $page.url.searchParams.delete('minPrice');
		max ? $page.url.searchParams.set('maxPrice', max) : $page.url.searchParams.delete('maxPrice');

		goto('?' + $page.url.searchParams, { keepfocus: true });
		dispatch('request-refresh');
	}

	onMount(updateSearchParams);

	onDestroy(() => {
		$page.url.searchParams.delete('token');
		$page.url.searchParams.delete('minPrice');
		$page.url.searchParams.delete('maxPrice');

		goto('?' + $page.url.searchParams);
		dispatch('request-refresh');
	});
</script>

<div>
	<Dropdown options={listingTokens} bind:selected={selectedToken} />

	<div class="w-full flex justify-between items-center gap-3 mt-4">
		<input
			type="text"
			class="w-24 h-10 border border-black border-opacity-50 rounded-md pl-4"
			placeholder="MIN"
			bind:value={min}
			min="0"
			use:regexFilter={{ regex: floatRe }}
			on:input={updateSearchParams}
		/>
		TO
		<input
			type="text"
			class="w-24 h-10 border border-black border-opacity-50 rounded-md pl-4"
			placeholder="MAX"
			bind:value={max}
			min="0"
			use:regexFilter={{ regex: floatRe }}
			on:input={updateSearchParams}
		/>
	</div>
</div>
