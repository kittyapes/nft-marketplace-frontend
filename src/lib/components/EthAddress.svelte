<script>
	import Copy from '$icons/copy.svelte';
	import { notifySuccess } from '$utils/toast';

	export let address = '';
	export let concat = false;
	export let charsFromStart = 6;
	export let charsFromEnd = 4;
	export let copyIcon = true;
	export let etherScanLink = true;

	const copyToClipboard = () => {
		navigator.clipboard.writeText(address);
		notifySuccess('Address Copied to Clipboard');
	};

	const concatAddress = (id) => {
		return `${id.substring(0, charsFromStart)}...${id.substring(id.length - charsFromEnd, id.length)}`;
	};

	$: visibleAddress = concat ? concatAddress(address) : address;
</script>

<div class="flex items-center gap-6 text-[#27C9FF] font-light italic {$$props.class}" on:click>
	{#if etherScanLink}
		<a href="https://etherscan.io/address/{address}" target="_blank">
			{visibleAddress}
		</a>
	{:else}
		<div>
			{visibleAddress}
		</div>
	{/if}

	{#if copyIcon}
		<button on:click={copyToClipboard} class="transition-btn">
			<Copy />
		</button>
	{/if}
</div>
