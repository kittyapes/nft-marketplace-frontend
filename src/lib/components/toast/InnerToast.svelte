<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	export let message: String;
	export let subMessage = '';
	export let icon: {
		src: typeof SvelteComponent;
		props?: { [key: string]: any };
	};

	export let extClass = '';
</script>

<div class="flex gap-4 items-center {extClass}">
	{#if icon}
		<div class="w-8 h-8">
			<svelte:component this={icon.src} {...icon.props} />
		</div>
	{/if}
	<div class="flex flex-col gap-2">
		<span class="text-lg">{message}</span>
		{#if subMessage}
			<p>{subMessage}</p>
		{/if}
	</div>
</div>
