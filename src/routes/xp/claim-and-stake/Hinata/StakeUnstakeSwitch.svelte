<script lang="ts">
	import BorderlessButton from '$lib/components/v2/BorderlessButton/BorderlessButton.svelte';

	export let state: 'stake' | 'unstake' = 'stake';
</script>

<div class="grid grid-cols-2 w-full mt-4">
	<BorderlessButton on:click={() => (state = 'stake')} selected={state === 'stake'}>
		Stake
	</BorderlessButton>

	<BorderlessButton on:click={() => (state = 'unstake')} selected={state === 'unstake'}>
		Unstake
	</BorderlessButton>
</div>
