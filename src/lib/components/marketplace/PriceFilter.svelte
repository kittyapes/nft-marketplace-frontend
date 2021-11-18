<script>
	import Dollar from '../icons/dollar.icon.svelte';
</script>

<div>
	TODO: Currency Dropdown
	<!-- <div class="relative text-gray-600 focus-within:text-gray-400">
		<button
			class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
			type="button"
			data-dropdown-toggle="dropdown"
		>
			<Dollar />
			Dropdown button
			<svg
				class="w-4 h-4 ml-2"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M19 9l-7 7-7-7"
				/></svg
			></button
		>

		
		<div
			class="bg-white text-base z-50 list-none divide-y divide-gray-100 rounded shadow my-4 "
			id="dropdown"
		>
			<ul class="py-1" aria-labelledby="dropdown">
				<li class="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2">Dashboard</li>

				<li class="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2">Settings</li>

				<li class="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2">Earnings</li>

				<li class="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2">Sign out</li>
			</ul>
		</div>
	</div> -->

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
