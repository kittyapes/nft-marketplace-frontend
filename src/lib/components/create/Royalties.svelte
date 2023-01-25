<script lang="ts">
	import { createToggle } from '$utils/misc/toggle';
	import AttachToElement from '$lib/components/AttachToElement.svelte';
	import InfoBubble from '$lib/components/v2/InfoBubble/InfoBubble.svelte';
	import { ethAddressRegex, isEthAddress } from '$utils/validator/isEthAddress';
	import Info from '$icons/info.v2.svelte';
	import { regexFilter } from '$actions/regexFilter';

	const feeInputRegex = /^([0-9]|[0-9]{2})(\.[0-9]{0,2})?$/;

	export let values: { fees: string | null; address: string }[] = [
		{ fees: '', address: '' },
		{ fees: '', address: '' },
		{ fees: '', address: '' },
	];

	export let error: string | boolean = true;
	export let disabled = false;

	let titleElementTooltip: HTMLElement;

	const titleHovered = createToggle();
	const tooltipHovered = createToggle();

	$: values.forEach((v) => {
		const addresses = values.map((i) => i.address.toLowerCase()).filter((i) => i);

		const total = values.reduce((acc, b) => acc + ((b?.fees && parseFloat(b.fees.toString())) || 0), 0);
		const hasZero = values.some((value) => parseFloat(value.fees) === 0);
		const hasDuplicates = new Set(addresses).size !== addresses.length;
		const hasInvalidAddress = addresses.map((i) => isEthAddress(i)).some((i) => !i);
		const hasPercentageWithoutAddress = values.reduce((acc, i) => acc || (i.fees && !i.address), false);
		const hasAddressWithoutPercentage = values.reduce((acc, i) => acc || (i.address && !i.fees), false);

		if (total !== 0 && total < 0.3) {
			error = 'The sum of royalties cannot be lower than 0.3 %';
		} else if (total > 98.5) {
			error = 'Sum of Royalties Cannot Exceed 98.5 %';
		} else if (hasZero) {
			error = 'Royalty Must be a Non-Zero Value';
		} else if (hasDuplicates) {
			error = 'Royalties contain duplicate addresses';
		} else if (hasInvalidAddress) {
			error = 'Royalties contain an invalid ETH address';
		} else if (hasPercentageWithoutAddress) {
			error = 'Royalties contain a percentage without an address';
		} else if (hasAddressWithoutPercentage) {
			error = 'Royalties contain an address without a percentage';
		} else {
			error = true;
		}
	});
</script>

<div class="pr-6">
	<h1 class="{$$props.class} flex items-center gap-x-2.5 font-medium text-base 2xl:text-xl leading-5 2xl:leading-6;">
		<span>Royalties</span>
		<span class="w-4 h-4 cursor-pointer" bind:this={titleElementTooltip} on:pointerenter={titleHovered.toggle} on:pointerleave={titleHovered.toggle}>
			<Info />
		</span>
	</h1>

	<div class="flex flex-col mt-4 2xl:mt-6">
		<div class="flex w-full gap-x-4 ">
			<div class="font-medium text-xs 2xl:text-sm leading-4 2xl:leading-5">Percentage</div>
			<div class="font-medium text-xs 2xl:text-sm leading-4 2xl:leading-5">Wallet address</div>
		</div>

		<div class="flex gap-x-4 w-full">
			<div class="flex flex-col">
				{#each values as value}
					<input
						type="text"
						class="mt-4 input p-0 first:mt-2 w-10 h-10 text-center text-white"
						placeholder="%"
						required={!!value.address}
						bind:value={value.fees}
						{disabled}
						use:regexFilter={{ regex: feeInputRegex }}
					/>
				{/each}
			</div>
			<div class="flex flex-col flex-grow">
				{#each values as value}
					<input
						type="text"
						class="mt-4 input rounded-none first:mt-2 h-10 "
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
</div>

{#if $titleHovered || $tooltipHovered}
	<AttachToElement to={titleElementTooltip} bottom offsetX={-20} offsetY={18}>
		<InfoBubble gradientText={false} on:pointerenter={tooltipHovered.toggle} on:pointerleave={tooltipHovered.toggle}>
			<div class="flex flex-col gap-4 p-4 font-medium text-xs 2xl:text-sm leading-6">
				<p class="">
					All sales are subject to both platform and creator fees. The Hinata platform fee for selling NFTs is a sliding scale up to 1.5% depending on membership level, and Verified Creators are able
					to set an additional royalty structure between up to 3 addresses. If over 20% in total setting royalties this high may discourage a healthy market!
				</p>
				<a class="flex items-center self-end gap-1 border-gradient bg-gradient-a clickable px-4 py-1.5" href="https://docs.hinata.io/trading-on-hinata/creator-royalties-and-platform-fees">
					<div class="">Learn More</div>
				</a>
			</div>
		</InfoBubble>
	</AttachToElement>
{/if}
