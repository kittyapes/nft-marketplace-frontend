<script>
	export let label;
	export let hidden = false;
</script>

{#if !hidden}
	<div>
		<div class="uppercase mb-2">{label}</div>
		<slot />
	</div>
{/if}
