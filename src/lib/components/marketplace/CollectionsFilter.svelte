<script>
	import Search from '../icons/search.icon.svelte';
</script>

<div class="relative text-gray-600 focus-within:text-gray-400">
	<span class="absolute inset-y-0 left-0 flex items-center pl-2">
		<button type="submit" class="p-1 focus:outline-none focus:shadow-outline"> <Search /> </button>
	</span>

	<input
		type="text"
		class="py-2 text-sm text-black rounded-md pl-10 border border-black border-opacity-50 h-10  w-full"
		placeholder="Search..."
		autocomplete="off"
	/>
</div>
