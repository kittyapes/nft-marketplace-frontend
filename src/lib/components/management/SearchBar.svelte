<script lang="ts">
	import Search from '$icons/search.svelte';

	export let placeholder = '';
</script>

<div class="input flex gap-4 focus-within:border-[#1d1d1d] items-center">
	<Search />

	<input type="text" class="w-72 focus:outline-none  " {placeholder} />
</div>
