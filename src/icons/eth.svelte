<script lang="ts">
	export let gradient = false;
</script>

{#if gradient}
	<svg
		width="11"
		height="16"
		viewBox="0 0 11 16"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		class={$$props.class}
	>
		<path
			d="M10.722 8.15L5.50039 11.05L0.275391 8.15L5.50039 0L10.722 8.15ZM5.50039 11.9812L0.275391 9.08125L5.50039 16L10.7254 9.08125L5.50039 11.9812Z"
			fill="url(#grad)"
		/>
		<defs>
			<linearGradient id="grad" x1="0" x2="0" y1="100%" y2="0">
				<stop offset="0%" stop-color="#868BF7" />
				<stop offset="100%" stop-color="#6CC7F8" />
			</linearGradient>
		</defs>
	</svg>
{:else}
	<svg
		width="11"
		height="16"
		viewBox="0 0 11 16"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		class={$$props.class}
	>
		<path
			d="M10.722 8.15L5.50039 11.05L0.275391 8.15L5.50039 0L10.722 8.15ZM5.50039 11.9812L0.275391 9.08125L5.50039 16L10.7254 9.08125L5.50039 11.9812Z"
			fill="currentColor"
		/>
	</svg>
{/if}
