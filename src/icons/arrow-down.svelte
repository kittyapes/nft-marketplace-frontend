<script lang="ts">
	export let gradientColors: {
		start?: string;
		half?: string;
		end?: string;
	} = {};

	export let id = '';
</script>

<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class={$$props.class}>
	<path
		d="M5.41 6.30273L10 10.8827L14.59 6.30273L16 7.71273L10 13.7127L4 7.71273L5.41 6.30273Z"
		fill={gradientColors?.start || gradientColors?.half || gradientColors?.end ? `url(#gradient_${id})` : 'currentColor'}
	/>

	{#if gradientColors?.start || gradientColors?.half || gradientColors?.end}
		<defs>
			<linearGradient id="gradient_{id}" x1="4" y1="10.0077" x2="16.1503" y2="10.0077" gradientUnits="userSpaceOnUse">
				<stop stop-color={gradientColors?.start} />
				<stop offset="0.5" stop-color={gradientColors?.half} />
				<stop offset="1" stop-color={gradientColors?.end} />
			</linearGradient>
		</defs>
	{/if}
</svg>
