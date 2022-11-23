<div class="aspect-w-6 aspect-h-5" on:pointerenter on:pointerleave>
	<button
		on:click
		class="p-1 cursor-pointer border border-white 
		from-color-purple to-color-blue"
	>
		<div class="h-full rounded-xl grid place-items-stretch">
			<slot />
		</div>
	</button>
</div>
