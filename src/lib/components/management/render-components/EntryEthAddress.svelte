<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import EthAddress from '$lib/components/EthAddress.svelte';
	import ColumnComponentContainer from '../ColumnComponentContainer.svelte';
	import { hoverHint } from '$actions/hoverHint';
	import { notifySuccess } from '$utils/toast';

	export let props;

	const copyToClipboard = () => {
		navigator.clipboard.writeText(props?.address);
		notifySuccess('Copied to Clipboard');
	};
</script>

<ColumnComponentContainer>
	<Eth />
	<!--<div use:hoverHint={{ text: props.address, targetId: 'hint-target' }} class="">
		<div id="hint-target" class="">-->
	<EthAddress
		address={props.address}
		concat
		copyIcon={false}
		etherScanLink={false}
		charsFromStart={11}
		charsFromEnd={5}
		class="!text-lg !not-italic !font-semibold !text-color-black clickable w-full h-full"
		on:click={copyToClipboard}
	/>
	<!--	</div>
	</div>-->
</ColumnComponentContainer>
