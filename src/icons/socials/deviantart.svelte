<script lang="ts">
	export let gradient = false;
</script>

{#if gradient}
	<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class={$$props.class}>
		<defs>
			<linearGradient id="grad" x1="0" x2="100%" y1="0" y2="0">
				<stop offset="0%" stop-color="#868BF7" />
				<stop offset="100%" stop-color="#6CC7F8" />
			</linearGradient>
		</defs>
		<g clip-path="url(#clip0_5904_29506)">
			<path
				d="M17.8855 16.6797L17.9708 22.5751H14.3825C14.7828 20.8722 15.589 19.4994 17.9105 19.1573L17.8855 18.3883C12.7789 19.0555 11.6954 21.8612 11.6235 23.8617L19.8505 23.8568V18.9358C22.3214 18.8724 25.4093 18.9694 26.258 22.5458L22.6029 22.5159V20.0084C21.9484 19.8173 21.3845 19.814 20.7602 19.8574L20.7298 23.8465L28.8861 23.8449C28.9645 19.857 25.4209 18.05 19.8505 18.1358V16.6797H17.8855L17.8855 16.6797Z"
				fill="url(#grad)"
			/>
		</g>
		<rect x="0.5" y="0.5" width="39" height="39" stroke="url(#grad)" />
		<defs>
			<clipPath id="clip0_5904_29506">
				<rect width="17.3503" height="17.3793" fill="url(#grad)" transform="translate(11.5791 11.5791)" />
			</clipPath>
		</defs>
	</svg>
{:else}
	<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class={$$props.class}>
		<g clip-path="url(#clip0_5904_29506)">
			<path
				d="M17.8855 16.6797L17.9708 22.5751H14.3825C14.7828 20.8722 15.589 19.4994 17.9105 19.1573L17.8855 18.3883C12.7789 19.0555 11.6954 21.8612 11.6235 23.8617L19.8505 23.8568V18.9358C22.3214 18.8724 25.4093 18.9694 26.258 22.5458L22.6029 22.5159V20.0084C21.9484 19.8173 21.3845 19.814 20.7602 19.8574L20.7298 23.8465L28.8861 23.8449C28.9645 19.857 25.4209 18.05 19.8505 18.1358V16.6797H17.8855L17.8855 16.6797Z"
				fill="currentColor"
			/>
		</g>
		<rect x="0.5" y="0.5" width="39" height="39" stroke="currentColor" />
		<defs>
			<clipPath id="clip0_5904_29506">
				<rect width="17.3503" height="17.3793" fill="currentColor" transform="translate(11.5791 11.5791)" />
			</clipPath>
		</defs>
	</svg>
{/if}
