<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Circle from '$lib/components/staking/Circle.svelte';

	export let description: string = '';
	export let actions: [string, string][] = [];
	export let action: string = '';
</script>

<p class="font-normal text-center mt-6 text-lg">
	{@html description}
</p>

<div class="flex mt-8 gap-8">
	{#each actions as [a, label]}
		<Circle
			text={label}
			variant={action === a ? 'selected' : 'default'}
			on:click={() => (action = a)}
		/>
	{/each}
</div>
