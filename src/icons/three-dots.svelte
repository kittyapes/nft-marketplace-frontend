<script lang="ts">
	export let gradient = false;
</script>

{#if gradient}
	<svg width="20" height="5" viewBox="0 0 20 5" fill="none" xmlns="http://www.w3.org/2000/svg">
		<rect y="0.425781" width="4" height="4" fill="#67D4F8" />
		<rect y="0.425781" width="4" height="4" fill="url(#paint0_linear_7349_69226)" />
		<rect x="8" y="0.425781" width="4" height="4" fill="#67D4F8" />
		<rect x="8" y="0.425781" width="4" height="4" fill="url(#paint1_linear_7349_69226)" />
		<rect x="16" y="0.425781" width="4" height="4" fill="#67D4F8" />
		<rect x="16" y="0.425781" width="4" height="4" fill="url(#paint2_linear_7349_69226)" />
		<defs>
			<linearGradient id="paint0_linear_7349_69226" x1="-1.37371" y1="1.21267" x2="4.00768" y2="-2.32617" gradientUnits="userSpaceOnUse">
				<stop stop-color="#A794FF" stop-opacity="0" />
				<stop offset="0.398438" stop-color="#A794FF" stop-opacity="0.93" />
				<stop offset="1" stop-color="#8E77F7" stop-opacity="0" />
				<stop offset="1" stop-color="#8E77F7" stop-opacity="0" />
				<stop offset="1" stop-color="#A794FF" stop-opacity="0" />
			</linearGradient>
			<linearGradient id="paint1_linear_7349_69226" x1="6.62629" y1="1.21267" x2="12.0077" y2="-2.32617" gradientUnits="userSpaceOnUse">
				<stop stop-color="#A794FF" stop-opacity="0" />
				<stop offset="0.398438" stop-color="#A794FF" stop-opacity="0.93" />
				<stop offset="1" stop-color="#8E77F7" stop-opacity="0" />
				<stop offset="1" stop-color="#8E77F7" stop-opacity="0" />
				<stop offset="1" stop-color="#A794FF" stop-opacity="0" />
			</linearGradient>
			<linearGradient id="paint2_linear_7349_69226" x1="14.6263" y1="1.21267" x2="20.0077" y2="-2.32617" gradientUnits="userSpaceOnUse">
				<stop stop-color="#A794FF" stop-opacity="0" />
				<stop offset="0.398438" stop-color="#A794FF" stop-opacity="0.93" />
				<stop offset="1" stop-color="#8E77F7" stop-opacity="0" />
				<stop offset="1" stop-color="#8E77F7" stop-opacity="0" />
				<stop offset="1" stop-color="#A794FF" stop-opacity="0" />
			</linearGradient>
		</defs>
	</svg>
{:else}
	<svg width="20" height="5" viewBox="0 0 20 5" fill="none" xmlns="http://www.w3.org/2000/svg">
		<rect y="0.425781" width="4" height="4" fill="white" />
		<rect x="8" y="0.425781" width="4" height="4" fill="white" />
		<rect x="16" y="0.425781" width="4" height="4" fill="white" />
	</svg>
{/if}
