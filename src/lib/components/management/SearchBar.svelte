<script lang="ts">
	import Search from '$icons/search.svelte';
	import { debounce } from 'lodash-es';

	export let placeholder = '';
	export let query: string;

	let focused = false;
</script>

<div class="input flex-grow flex gap-4 border-2 {focused ? 'border-color-purple' : ''} items-center font-medium">
	<Search />

	<input
		on:focus={() => {
			focused = true;
		}}
		on:blur={() => {
			focused = false;
		}}
		type="text"
		class="bg-transparent text-white w-full focus:outline-none"
		{placeholder}
		bind:value={query} />
</div>
