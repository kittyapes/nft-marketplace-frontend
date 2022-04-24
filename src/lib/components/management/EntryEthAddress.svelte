<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import EthAddress from '../EthAddress.svelte';
	import ColumnComponentContainer from './ColumnComponentContainer.svelte';

	export let props;
</script>

<ColumnComponentContainer>
	<Eth />
	<EthAddress address={props.address} concat class="text-lg text-color-black font-bold" />
</ColumnComponentContainer>
