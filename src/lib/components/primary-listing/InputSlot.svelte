<script>
	export let label;
	export let hidden = false;
</script>

{#if !hidden}
	<div>
		<div class="font-medium mb-2">{label}</div>
		<slot />
	</div>
{/if}
