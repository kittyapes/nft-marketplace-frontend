<script>
	import Copy from '$icons/copy.svelte';

	export let address = '';
</script>

<div class="flex items-center gap-6">
	<span class="text-color-blue">{address} </span>
	<Copy />
</div>
