<script>
	import Copy from '$icons/copy.svelte';
	import { notifySuccess } from '$utils/toast';

	export let address = '';

	const copyToClipboard = () => {
		navigator.clipboard.writeText(address);
		notifySuccess('Address Copied to Clipboard');
	};
</script>

<div class="flex items-center gap-6">
	<span class="text-color-blue font-bold">{address} </span>
	<button on:click={copyToClipboard}>
		<Copy />
	</button>
</div>
