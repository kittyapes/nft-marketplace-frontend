<script>
	import Copy from '$icons/copy.svelte';
	import { notifySuccess } from '$utils/toast';

	export let address = '';
	export let concat = false;

	const copyToClipboard = () => {
		navigator.clipboard.writeText(address);
		notifySuccess('Address Copied to Clipboard');
	};

	const concatAddress = (id) => {
		return `${id.substring(0, 6)}...${id.substring(id.length - 4, id.length)}`;
	};

	$: address = concat ? concatAddress(address) : address;
</script>

<div class="flex items-center gap-6 {$$props.class}">
	<span class="text-color-blue font-bold">{address} </span>
	<button on:click={copyToClipboard}>
		<Copy />
	</button>
</div>
