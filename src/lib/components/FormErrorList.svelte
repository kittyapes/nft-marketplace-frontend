<script lang="ts">
	import { slide } from 'svelte/transition';

	export let validity: { [key: string]: boolean | string };
</script>

<ul class="list-disc pl-8">
	{#each Object.entries(validity) as [key, messageOrTrue]}
		{#if typeof messageOrTrue === 'string'}
			<li class="mt-2 text-red-500" transition:slide|local>{messageOrTrue}</li>
		{:else if messageOrTrue === false}
			<li class="mt-2 text-red-500" transition:slide|local>Field {key} is invalid</li>
		{/if}
	{/each}
</ul>
