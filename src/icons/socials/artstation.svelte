<script lang="ts">
	export let gradient = false;
</script>

{#if gradient}
	<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class={$$props.class}>
		<defs>
			<linearGradient id="grad" x1="0" x2="100%" y1="0" y2="0">
				<stop offset="0%" stop-color="#868BF7" />
				<stop offset="100%" stop-color="#6CC7F8" />
			</linearGradient>
		</defs>
		<rect x="0.5" y="0.5" width="39" height="39" stroke="currentColor" />

		<g clip-path="url(#clip0_812_27065)">
			<path
				d="M11 24.2923L12.5204 26.9203C12.6716 27.2211 12.9034 27.4741 13.1899 27.651C13.4765 27.8279 13.8065 27.9218 14.1432 27.9221H24.2362L22.1414 24.2923H11ZM29 24.3097C28.9992 23.9606 28.8985 23.619 28.7097 23.3253L22.7945 13.0451C22.6403 12.753 22.4093 12.5086 22.1263 12.3382C21.8434 12.1678 21.5194 12.0779 21.1891 12.0781H18.0633L27.1983 27.9041L28.64 25.4111C28.9212 24.9335 29.0006 24.7226 29.0006 24.3097H29ZM20.6531 21.7143L16.5721 14.6448L12.4884 21.7143H20.6531Z"
				fill="url(#grad)"
			/>
		</g>
		<defs>
			<clipPath id="clip0_812_27065">
				<rect width="18" height="18" fill="white" transform="translate(11 11)" />
			</clipPath>
		</defs>
	</svg>
{:else}
	<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class={$$props.class}>
		<rect x="0.5" y="0.5" width="39" height="39" stroke="currentColor" />

		<g clip-path="url(#clip0_812_27065)">
			<path
				d="M11 24.2923L12.5204 26.9203C12.6716 27.2211 12.9034 27.4741 13.1899 27.651C13.4765 27.8279 13.8065 27.9218 14.1432 27.9221H24.2362L22.1414 24.2923H11ZM29 24.3097C28.9992 23.9606 28.8985 23.619 28.7097 23.3253L22.7945 13.0451C22.6403 12.753 22.4093 12.5086 22.1263 12.3382C21.8434 12.1678 21.5194 12.0779 21.1891 12.0781H18.0633L27.1983 27.9041L28.64 25.4111C28.9212 24.9335 29.0006 24.7226 29.0006 24.3097H29ZM20.6531 21.7143L16.5721 14.6448L12.4884 21.7143H20.6531Z"
				fill="currentColor"
			/>
		</g>
		<defs>
			<clipPath id="clip0_812_27065">
				<rect width="18" height="18" fill="white" transform="translate(11 11)" />
			</clipPath>
		</defs>
	</svg>
{/if}
