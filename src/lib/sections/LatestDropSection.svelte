<script>
	import Button from '$lib/components/Button.svelte';
</script>

<div class="flex">
	<div class="aspect-h-1 aspect-w-2 w-1/2">
		<div class="bg-[#F9F9F9] grid place-items-center">
			<div class="rounded-xl border p-4 pt-2">
				<div class="text-center font-semibold text-[#A95ABC]">HEILROOM</div>
				<img src="/img/placeholder/latest-drop.png" alt="" class="mt-2" />
			</div>
		</div>
	</div>

	<div class="w-1/2 pl-16 flex flex-col justify-center">
		<div class="uppercase tracking-widest font-bold text-[#4D4D4D]">Series 11 latest drop</div>
		<div class="font-normal text-5xl mt-4">The Gatekeeper</div>

		<div class="flex items-center gap-x-2 mt-4">
			<img src="https://picsum.photos/40/40" alt="" class="rounded-full h-8 w-8" />
			<div class="font-semibold">@mifun</div>
		</div>

		<div class="mt-4 mb-6">
			Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor. Voluptate
			exercitation incididunt aliquip deserunt reprehenderit elit laborum.
		</div>

		<Button variant="rounded-black">Place a Bid</Button>
	</div>
</div>
