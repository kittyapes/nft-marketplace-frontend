<script lang="ts">
	import { WethContractAddress } from '$constants/contractAddresses';
	import Info from '$icons/info.v2.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import Toggle from '$lib/components/Toggle.svelte';

	import TokenDropdown from '$lib/components/TokenDropdown.svelte';
	import type { ListingType } from '$utils/api/listing';
	import { getIconUrl } from '$utils/misc/getIconUrl';
	import ListingTypeSwitch from './ListingTypeSwitch.svelte';

	let selectedListingType: ListingType = 'sale';
	let selectedDuration;

	const tokens = [{ label: 'ETH', iconUrl: getIconUrl('eth.black'), value: WethContractAddress }];
	const durationOptions = [
		{ label: '1 day', value: 1 },
		{ label: '3 days', value: 3 },
		{ label: '7 days', value: 7 },
		{ label: '1 month', value: 30 },
		{ label: '3 months', value: 90 },
		{ label: '6 months', value: 180 }
	];
</script>

<div>
	<!-- Listing Type -->
	<div class="mt-4 font-semibold">Listing Type</div>
	<div class="mt-2"><ListingTypeSwitch /></div>

	{#if selectedListingType === 'sale'}
		<!-- Price -->
		<div class="mt-4 font-semibold">Price</div>
		<div class="mt-2">
			<TokenDropdown dropdownBg="white" dropdownColor="black" dropdownButtonBg="white" dropdownButtonColor="black" showLabel showArrow={false} {tokens} buttonDisabled />
		</div>

		<!-- Duration -->
		<div class="mt-4 font-semibold">Duration</div>
		<div class="mt-2">
			<Dropdown options={durationOptions} bind:selected={selectedDuration} borderOpacity={1} />
		</div>

		<!-- Specific buyer -->
		{#if false}
			<div class="mt-4 flex space-x-2">
				<Toggle --width="3rem" onInsideLabel="" offInsideLabel="" />
				<div class="font-semibold">Reserve for specific buyer</div>
			</div>
		{/if}

		<!-- Fees -->
		<div class="mt-4 font-semibold">Fees</div>
		<div class="grid gap-2 mt-2 font-semibold" style:grid-template-columns="auto 6rem">
			<div>Creator Royalties:</div>
			<div class="flex justify-end space-x-2">
				<div class="">0.0%</div>
				<div class="w-6">
					<Info />
				</div>
			</div>

			<div class="gradient-text">Hinata Fees:</div>
			<div class="flex justify-end space-x-2">
				<div class="gradient-text">0%</div>
				<div class="w-6">
					<Info />
				</div>
			</div>
		</div>
	{/if}

	<button class="btn btn-gradient btn-rounded w-full uppercase mt-8">Complete Listing</button>
</div>
