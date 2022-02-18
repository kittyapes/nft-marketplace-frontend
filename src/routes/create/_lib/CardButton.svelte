<!-- <button
	on:click
	class=" border-2 border-[#1D1D1D4D] aspect-w-6 aspect-h-5 cursor-pointer
    hover:border-color-purple transition "
/> -->

<div class="aspect-w-6 aspect-h-5">
	<button
		on:click
		class="rounded-2xl p-1 cursor-pointer bg-[#DDDDDD] hover:bg-gradient-to-r from-color-purple to-color-blue"
	>
		<div class="bg-white h-full rounded-xl grid place-items-stretch">
			<slot />
		</div>
	</button>
</div>
