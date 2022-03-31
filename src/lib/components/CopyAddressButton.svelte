<script lang="ts">
	import Copy from '$icons/copy.svelte';
	import copyTextToClipboard from '$utils/copyTextToClipboard';
	import { shortenAddress } from '$utils/misc/shortenAddress';

	export let address: string;
</script>

<button
	class="btn btn-rounded btn-shadow w-[11rem] py-2"
	on:click={() => copyTextToClipboard(address)}
>
	<div class="flex items-center">
		<div class="flex-grow font-norma">
			{shortenAddress(address)}
		</div>
		<Copy />
	</div>
</button>
