<script lang="ts">
	import { createToggle } from '$utils/misc/toggle';
	import AttachToElement from '$lib/components/AttachToElement.svelte';
	import InfoBubble from '$lib/components/v2/InfoBubble/InfoBubble.svelte';
	import { ethAddressRegex, isEthAddress } from '$utils/validator/isEthAddress';
	import Info from '$icons/info.v2.svelte';
	import ExternalLink from '$icons/external-link.svelte';
	import { regexFilter } from '$actions/regexFilter';

	const feeInputRegex = /^([0-9]|[0-9]{2})(\.[0-9]{0,2})?$/;

	export let values: { fees: number | string; address: string }[] = [
		{ fees: '', address: '' },
		{ fees: '', address: '' },
		{ fees: '', address: '' }
	];

	export let isValid: boolean | string = false;
	export let disabled = false;

	let titleElementTooltip: HTMLElement;

	const titleHovered = createToggle();
	const tooltipHovered = createToggle();

	$: isValid = false;
	$: values.forEach((v) => {
		let total = values.reduce((acc, b) => acc + ((b?.fees && parseFloat(b.fees.toString())) || 0), 0);

		// More than one entry has this value
		let areAddressesSimilar =
			values.filter((item) => !!item.address && !!v.address && isEthAddress(item.address) && isEthAddress(v.address) && item.address.toLowerCase() === v.address.toLowerCase()).length > 1;

		console.log(total);
		if (total < 0.3) isValid = 'Sum of Royalties Cannot Be Below 0.3 %';
		else {
			isValid =
				total > 98.5
					? 'Sum of Royalties Cannot Exceed 98.5 %'
					: areAddressesSimilar
					? 'Please Enter Unique Addresses To Each Field'
					: (!!v.fees === !!v.address && isEthAddress(v.address)) || (v.fees == '' && v.address == '');
		}
	});
</script>

<div class="pr-12">
	<h1 class="{$$props.class} uppercase font-semibold mt-8 flex items-center gap-x-1">
		<span>Royalties</span>
		<span class="w-4 h-4 cursor-pointer" bind:this={titleElementTooltip} on:pointerenter={titleHovered.toggle} on:pointerleave={titleHovered.toggle}>
			<Info />
		</span>
	</h1>

	<div class="flex mt-4 gap-x-4">
		<div id="percent-container" class="grid w-24">
			<div class="text-sm font-light uppercase text-color-black">Percentage</div>
			{#each values as value}
				<input type="text" class="mt-4 input input-hide-controls first:mt-2" placeholder="%" required={!!value.address} bind:value={value.fees} {disabled} use:regexFilter={{ regex: feeInputRegex }} />
			{/each}
		</div>

		<div class="grid flex-grow">
			<div class="text-sm font-light uppercase text-color-black">Wallet address</div>
			{#each values as value}
				<input
					type="text"
					class="mt-4 input first:mt-2"
					placeholder="Enter wallet address"
					autocomplete="nope"
					pattern={ethAddressRegex}
					required={!!value.fees}
					bind:value={value.address}
					{disabled}
				/>
			{/each}
		</div>
	</div>
</div>

{#if $titleHovered || $tooltipHovered}
	<AttachToElement to={titleElementTooltip} bottom offsetX={-20} offsetY={18}>
		<InfoBubble gradientText={false} on:pointerenter={tooltipHovered.toggle} on:pointerleave={tooltipHovered.toggle}>
			<div class="flex flex-col gap-4 p-4">
				<div class="">
					All sales are subject to both platform and creator fees. The Hinata platform fee for selling NFTs is a sliding scale up to 1.5% depending on membership level, and Verified Creators are able
					to set an additional royalty structure between up to 3 addresses. If over 20% in total setting royalties this high may discourage a healthy market!
				</div>
				<a class="flex items-center self-end gap-1 text-black clickable" href="https://docs.hinata.io/trading-on-hinata/creator-royalties-and-platform-fees">
					<div class="">Read More</div>
					<ExternalLink />
				</a>
			</div>
		</InfoBubble>
	</AttachToElement>
{/if}

<style>
	input {
		@apply w-full h-12 disabled:text-gray-400;
	}

	#percent-container input {
		@apply text-center;
	}
</style>
