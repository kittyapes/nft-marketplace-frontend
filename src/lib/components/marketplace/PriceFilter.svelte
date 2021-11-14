<script>
	import Dollar from '../icons/dollar.icon.svelte';
</script>

<div>
	<div class="relative text-gray-600 focus-within:text-gray-400">
		<span class="absolute inset-y-0 left-0 flex items-center pl-2">
			<button type="submit" class="p-1 focus:outline-none focus:shadow-outline">
				<Dollar />
			</button>
		</span>

		<input
			type="text"
			class="py-2 text-sm text-black rounded-md pl-12 border border-black border-opacity-50 h-10  w-full"
			placeholder="USD"
			autocomplete="off"
		/>
	</div>

	<div class="w-full flex justify-between items-center gap-3 mt-4">
		<input
			class="w-24 h-10 border border-black border-opacity-50 rounded-md pl-4"
			placeholder="MIN"
		/>
		TO
		<input
			class="w-24 h-10 border border-black border-opacity-50 rounded-md pl-4"
			placeholder="MAX"
		/>
	</div>
</div>
