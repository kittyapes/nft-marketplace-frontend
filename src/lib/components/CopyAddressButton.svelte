<script lang="ts">
	import Copy from '$icons/copy.svelte';
	import copyTextToClipboard from '$utils/copyTextToClipboard';
	import { shortenAddress } from '$utils/misc/shortenAddress';
	import Button from './Button.svelte';

	export let address: string;
</script>

<Button
	variant="rounded-shadow"
	rounded
	--py="0.5rem"
	--px="1.5rem"
	--width="11rem"
	on:click={() => copyTextToClipboard(address)}
>
	<div class="flex items-center">
		<div class="flex-grow font-norma">
			{shortenAddress(address)}
		</div>
		<Copy />
	</div>
</Button>
