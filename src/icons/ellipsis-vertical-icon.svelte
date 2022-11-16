<script lang="ts">
	export let gradient = false;
</script>

{#if gradient}
	<svg width="4" height="20" viewBox="0 0 4 20" fill="none" class={$$props.class} xmlns="http://www.w3.org/2000/svg">
		<defs>
			<linearGradient id="grad" x1="0" x2="100%" y1="0" y2="0">
				<stop offset="0%" stop-color="#868BF7" />
				<stop offset="100%" stop-color="#6CC7F8" />
			</linearGradient>
		</defs>
		<rect y="20" width="4" height="4" transform="rotate(-90 0 20)" fill="url(#grad)" />
		<rect y="12" width="4" height="4" transform="rotate(-90 0 12)" fill="url(#grad)" />
		<rect y="4" width="4" height="4" transform="rotate(-90 0 4)" fill="url(#grad)" />
	</svg>
{:else}
	<svg width="4" height="20" viewBox="0 0 4 20" fill="none" class={$$props.class} xmlns="http://www.w3.org/2000/svg">
		<rect y="20" width="4" height="4" transform="rotate(-90 0 20)" fill="currentColor" />
		<rect y="12" width="4" height="4" transform="rotate(-90 0 12)" fill="currentColor" />
		<rect y="4" width="4" height="4" transform="rotate(-90 0 4)" fill="currentColor" />
	</svg>
{/if}
