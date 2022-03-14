<script>
	export let disabled = false;
</script>

<div class="aspect-w-6 aspect-h-5" on:pointerenter on:pointerleave>
	<button
		on:click
		class="rounded-2xl p-1 cursor-pointer bg-[#DDDDDD]
		{disabled ? 'opacity-50' : 'hover:bg-gradient-to-r from-color-purple to-color-blue'}"
		{disabled}
	>
		<div class="bg-white h-full rounded-xl grid place-items-stretch">
			<slot />
		</div>
	</button>
</div>
