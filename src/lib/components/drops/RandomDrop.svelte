<script>
	export let name = '';
	export let series = '';
	export let generation = '';
	export let copiesAvailable = '';
</script>

<div class="w-full flex h-auto">
	<div class="w-1/3 flex items-center justify-center">
		<div class="w-80 h-80 bg-gray-100 m-4 p-6">
			<div class="w-full h-full flex items-center justify-center flex-col">
				<div
					class="mt-2 pt-1 pb-3 px-3 border-color-black border border-opacity-30 rounded-lg w-44 flex flex-col items-center"
				>
					<div class="text-xs mb-1 font-bold text-color-black">RANDOM</div>

					<div
						class="w-full h-52 bg-gray-200 rounded-lg flex items-center justify-center text-9xl text-color-purple"
					>
						?
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Content-->
	<div class="flex-grow m-4 pl-4 border-l-2">
		<div class="text-xs uppercase font-bold text-color-black opacity-70">random nft</div>
		<div class="text-lg mt-1 font-bold text-color-black">{name}</div>

		<div class="text-xs opacity-70 mt-6 text-color-black uppercase">Series</div>
		<div class="uppercase mt-1 font-bold flex items-center gap-2 text-color-black">
			{series}
		</div>

		<div class="text-xs opacity-70 mt-6 text-color-black uppercase">Generation</div>
		<div class=" mt-1 font-bold text-color-black">{generation}</div>

		<div class="mt-4 w-full border-b-2" />

		<div class="text-xs opacity-70 mt-2 text-color-black uppercase">Copies available</div>
		<div class=" font-bold text-color-black">{copiesAvailable}</div>

		<div class="mt-3 flex flex-row">
			<div
				class="w-36 border border-black rounded-full flex items-center justify-center p-2 text-sm m-px"
			>
				ROLL
			</div>

			<div
				class="w-36 border rounded-full text-white  flex items-center justify-center p-2 text-sm -ml-9 bg-gradient-to-r from-color-purple to-color-blue"
			>
				$25 | .01Ξ
			</div>
		</div>
	</div>
</div>
