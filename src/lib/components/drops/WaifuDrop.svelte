<script>
	import Button from '../Button.svelte';

	export let image = '';
	export let name = '';
	export let cardType = '';
	export let creatorAvatar = '';
	export let creatorUsername = '';
	export let totalSupply = 0;
	export let supply = 0;
	export let description;
	export let claimed = 0;
	export let copies = 0;
	export let dropType = '';
	export let price = '';
</script>

<div class="w-full m-7 flex h-auto py-8">
	<!-- Description -->
	<div class="w-1/3 flex flex-col justify-center">
		<div class="text-2xl font-bold text-color-black">{name}</div>

		<div class="text-base mt-4 font-bold flex items-center gap-2 text-color-black">
			<img src={creatorAvatar} alt="avatar" class="w-6 h-6 rounded-full" />
			<span>@{creatorUsername}</span>
		</div>

		<div class="mt-6">
			<span class="text-color-black font-bold text-opacity-70">Edition:</span>
			<span class="text-color-black ">{supply} of {totalSupply}</span>
		</div>

		<div class="mt-5">
			<div class="text-color-black text-opacity-70 font-bold">Description:</div>
			<span class="text-color-black">{description} </span>
		</div>
	</div>

	<!-- Card image -->
	<div class="w-1/3 border-r-2 border-color-black border-opacity-30">
		<div class="w-80 h-80 flex items-center justify-center">
			<div class="w-full h-full flex items-center justify-center flex-col">
				<div
					class="mt-2 pt-1 pb-3 px-3 border-color-black border border-opacity-30 rounded-lg w-52 flex flex-col items-center"
				>
					<div class="text-xs mb-1 font-bold text-yellow-700 uppercase">{cardType}</div>
					<img src={image} alt="ape" class="w-full rounded-lg" />
				</div>
			</div>
		</div>
	</div>

	<!-- Stats -->
	<div class="w-1/3 flex flex-col justify-center ">
		<div class="w-full pl-4 border-b-2 pb-6">
			<div class="uppercase text-xs text-color-black text-opacity-70 font-bold">Claimed:</div>
			<div class="font-bold text-color-black text-lg">{claimed}</div>

			<div class="uppercase text-xs text-color-black text-opacity-70 font-bold mt-5">
				Copies remaining
			</div>
			<div class="font-bold text-color-black text-lg">{copies}</div>
		</div>

		<div class="w-full pl-4 mt-6">
			<div class="uppercase text-xs text-color-black text-opacity-70 font-bold">drop type:</div>
			<div class="font-bold text-color-black text-lg uppercase">{dropType}</div>

			<div class="max-w-xs mt-6">
				<Button gradient rounded>{price}</Button>
			</div>
		</div>
	</div>
</div>
