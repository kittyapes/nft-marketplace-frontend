<script>
	export let secondary = false;

	$: stroke = (secondary && '#8391F7') || 'white';
</script>

<!-- By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL -->
<svg class="absolute top-0 bottom-0 left-0 w-8 my-auto ml-2" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff">
	<g fill="none" fill-rule="evenodd">
		<g transform="translate(1 1)" stroke-width="2">
			<circle stroke-opacity=".5" cx="18" cy="18" r="18" {stroke} />
			<path d="M36 18c0-9.94-8.06-18-18-18" {stroke}>
				<animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" />
			</path>
		</g>
	</g>
</svg>
