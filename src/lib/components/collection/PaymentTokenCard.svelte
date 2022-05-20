<script lang="ts">
	export let iconUrl: string;
	export let symbol: string;
	export let name: string;
</script>

<div class="border border-black flex flex-row rounded-md w-56 py-2 cursor-not-allowed">
	<div class="m-4 grid place-items-center w-4">
		<img src={iconUrl} alt="{symbol} icon." />
	</div>

	<div class="mt-2">
		<div class="font-bold">{symbol}</div>
		<div class="-mt-1 text-[#1D1D1D66]">{name}</div>
	</div>
</div>
