<script lang="ts">
	import Search from '$icons/search.svelte';
	import { debounce } from 'lodash-es';

	export let placeholder = '';
	export let query: string;
</script>

<div class="input flex gap-4 border-2 focus-within:border-[#1d1d1d] items-center">
	<Search />

	<input type="text" class="w-72 focus:outline-none" {placeholder} bind:value={query} />
</div>
