<script lang="ts">
	import { closePopup } from '$utils/popup';

	export let address: string;
</script>

{#if address}
	<a href={'/profile/' + address} on:click={() => closePopup()}>{address || 'N/A'}</a>
{:else}
	N/A
{/if}
