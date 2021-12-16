<script>
	export let name = '';
	export let checked = false;
	export let id = 'check';
	export let label = '';
</script>

<label class="flex items-center gap-4 {$$props.class}">
	<input type="checkbox" class="w-6 h-6" {id} {name} {checked} />
	{label}
</label>
