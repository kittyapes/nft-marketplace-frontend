<script lang="ts">
	import Eth from '$icons/eth-v2.svelte';
	import EthAddress from '$lib/components/EthAddress.svelte';
	import ColumnComponentContainer from '../ColumnComponentContainer.svelte';

	export let props;
</script>

<ColumnComponentContainer>
	<Eth />
	<EthAddress address={props.address} concat etherScanLink={false} charsFromStart={11} charsFromEnd={5} v2 class="!text-lg !not-italic !font-semibold !text-color-black w-full h-full" />
</ColumnComponentContainer>
