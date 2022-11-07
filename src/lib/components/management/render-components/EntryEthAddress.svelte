<script lang="ts">
	import Eth from '$icons/eth-v2.svelte';
	import EthAddress from '$lib/components/EthAddress.svelte';
	import ColumnComponentContainer from '../ColumnComponentContainer.svelte';
	import { notifySuccess } from '$utils/toast';

	export let props;

	const copyToClipboard = () => {
		navigator.clipboard.writeText(props?.address);
		notifySuccess('Copied to Clipboard');
	};
</script>

<ColumnComponentContainer>
	<Eth />
	<EthAddress
		address={props.address}
		concat
		etherScanLink={false}
		charsFromStart={11}
		charsFromEnd={5}
		tooltip
		v2
		class="!text-lg !not-italic !font-semibold !text-color-black clickable w-full h-full"
		on:click={copyToClipboard}
	/>
</ColumnComponentContainer>
