<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import EthAddress from '$lib/components/EthAddress.svelte';
	import ColumnComponentContainer from '../ColumnComponentContainer.svelte';

	export let props;
</script>

<ColumnComponentContainer>
	<Eth />
	<EthAddress address={props.address} concat copyIcon={false} etherScanLink={false} charsFromStart={11} charsFromEnd={5} class="!text-lg !not-italic !font-semibold !text-color-black clickable" />
</ColumnComponentContainer>
