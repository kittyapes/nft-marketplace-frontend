<script>
	export let compact = false;
</script>

<div class="grid gap-x-8 gap-y-4" class:grid-cols-2={compact}>
	<slot />
</div>
