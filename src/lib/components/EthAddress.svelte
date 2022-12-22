<script>
	import Copy from '$icons/copy.svelte';
	import { notifySuccess } from '$utils/toast';
	import { hoverHint } from '$actions/hoverHint';
	import { fade } from 'svelte/transition';
	import Checkmark from '$icons/checkmark.svelte';

	export let address = '';
	export let concat = false;
	export let charsFromStart = 6;
	export let charsFromEnd = 4;
	export let copyIcon = true;
	export let etherScanLink = true;
	export let tooltip = false;
	export let v2 = false;

	let checkmark = false;

	const copyToClipboard = () => {
		navigator.clipboard.writeText(address);
		notifySuccess('Address Copied to Clipboard');
		checkmark = true;
		setTimeout(() => (checkmark = false), 3000);
	};

	const concatAddress = (id) => {
		if (id) return `${id.substring(0, charsFromStart)}...${id.substring(id.length - charsFromEnd, id.length)}`;
		else return '';
	};

	$: visibleAddress = concat ? concatAddress(address) : address;
</script>

<div use:hoverHint={{ text: address, targetId: `hint-target-${address}` }} on:click>
	<div class="w-full h-full transition-all " id={tooltip ? `hint-target-${address}` : ``} />
	<div class="flex items-center gap-2 text-[#27C9FF] font-light duration-200 {$$props.class}">
		{#if etherScanLink}
			<a href="https://etherscan.io/address/{address}" target="_blank">
				{visibleAddress}
			</a>
		{:else}
			<div class={v2 ? 'text-white font-medium' : ''}>
				{visibleAddress}
			</div>
		{/if}

		{#if copyIcon}
			<div class="w-5 h-5 grid place-items-center">
				{#if checkmark}
					<div class="grid place-items-center" in:fade>
						<Checkmark />
					</div>
				{:else}
					<button on:click|stopPropagation={copyToClipboard} class="transition-btn grid place-items-center" in:fade>
						<Copy />
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>
