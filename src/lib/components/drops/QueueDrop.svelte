<script>
	export let name = '';
	export let requirements = '';
	export let inQueue = '';
	export let price = '';
	export let image = '';
	export let currentPosition = '';
</script>

<div class="w-full flex h-auto">
	<div class="w-1/3 flex items-center justify-center">
		<div class="w-80 h-80 bg-gray-100 m-4 p-6">
			<div class="w-full h-full flex items-center justify-center flex-col">
				<div
					class="mt-2 pt-1 pb-3 px-3 border-color-black border border-opacity-30 rounded-lg w-44 flex flex-col items-center"
				>
					<div class="text-xs mb-1 font-bold text-yellow-700">LEGENDARY</div>
					<img src={image} alt="ape" class="w-full rounded-lg" />
				</div>
			</div>
		</div>
	</div>

	<!-- Content-->
	<div class="flex-grow m-4 pl-4 border-l-2">
		<div class="text-xs uppercase font-bold text-color-black opacity-70">QUEUE DROP</div>
		<div class="text-lg mt-1 font-bold text-color-black">{name}</div>

		<div class="text-xs opacity-70 mt-6 text-color-black">REQUIREMENTS TO ENTER</div>
		<div class="text-base mt-1 font-bold text-color-black">{requirements} WAIFU</div>

		<div class="text-xs opacity-70 mt-6 text-color-black">USERS IN QUEUE</div>
		<div class="text-base mt-1 font-bold text-color-black">{inQueue}</div>

		<div class="mt-4 w-full border-b-2" />

		<div class="text-xs opacity-70 mt-2 text-color-black">PRICE</div>
		<div class="text-base font-bold text-color-black">{price}</div>

		<div class="mt-3 flex flex-row">
			<div
				class="w-36 border border-black rounded-full flex items-center justify-center p-2 text-sm"
			>
				JOIN
			</div>

			<div
				class="w-36 border rounded-full text-white border-color-purple flex items-center justify-center p-2 text-sm -ml-7 bg-gradient-to-r from-color-purple to-color-blue"
			>
				PRE-QUEUE
			</div>
		</div>

		<div class="mt-1 font-bold text-sm text-color-purple">
			You are position {currentPosition} in queue
		</div>
	</div>
</div>
